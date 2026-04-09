
import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import imageKit from "../configs/imageKit.js";
import openai from "../configs/openai.js";

// Groq client for fallback
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// TEXT MESSAGE CONTROLLER
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;

        if (req.user.credits < 1) {
            return res.json({
                success: false,
                message: "You don't have enough credits to use this feature"
            });
        }

        const { chatId, prompt } = req.body;

        const chat = await Chat.findOne({ userId, _id: chatId });
        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        });

        // Use Groq API instead of Gemini
        let choices;
        let retries = 3;
        let delay = 1000;
        while (retries > 0) {
            try {
                const response = await groq.chat.completions.create({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: prompt }],
                });
                choices = response.choices;
                break;
            } catch (e) {
                console.error("Groq API Error:", e);
                if (e.status === 429 && retries > 1) {
                    await new Promise(res => setTimeout(res, delay));
                    delay *= 2;
                    retries--;
                } else {
                    throw e;
                }
            }
        }

        const reply = {
            ...choices[0].message,
            timestamp: Date.now(),
            isImage: false
        };

        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

        return res.json({ success: true, reply });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// IMAGE UPLOAD (FILE or URL) CONTROLLER
export const uploadImageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;

        if (req.user.credits < 2) {
            return res.json({
                success: false,
                message: "You don't have enough credits to use this feature"
            });
        }

        const { chatId, isPublished, imageUrl } = req.body;
        let base64Data;

        if (req.file) {
            // File uploaded via multipart
            base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        } else if (imageUrl) {
            // Image URL provided
            const resp = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            base64Data = `data:image/png;base64,${Buffer.from(resp.data, 'binary').toString('base64')}`;
        } else {
            return res.json({ success: false, message: 'Provide an image file or imageUrl' });
        }

        const uploadResponse = await imageKit.upload({
            file: base64Data,
            fileName: `${Date.now()}.png`,
            folder: 'chat-bottt'
        });

        const reply = {
            role: 'assistant',
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished: !!isPublished
        };

        const chat = await Chat.findOne({ userId, _id: chatId });
        chat.messages.push({
            role: 'user',
            content: imageUrl ? imageUrl : '[uploaded image]',
            timestamp: Date.now(),
            isImage: true
        });
        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

        return res.json({ success: true, reply });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


// IMAGE MESSAGE CONTROLLER
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;

        if (req.user.credits < 2) {
            return res.json({
                success: false,
                message: "You don't have enough credits to use this feature"
            });
        }

        const { prompt, chatId, isPublished } = req.body;

        const chat = await Chat.findOne({ userId, _id: chatId });

        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        });

        // Encode prompt
        const encodedPrompt = encodeURIComponent(prompt);

        // Construct URL using Pollinations AI (free, no key needed)
        const generatedImageUrl =
            `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&nologo=true`;

        // Fetch image
        const aiImageResponse = await axios.get(generatedImageUrl, {
            responseType: "arraybuffer"
        });

        // Convert to base64
        const base64Image =
            `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString("base64")}`;

        let finalImageUrl = generatedImageUrl; // fallback to direct pollinations url
        try {
            // Upload to imageKit
            const uploadResponse = await imageKit.upload({
                file: base64Image,
                fileName: `${Date.now()}.png`,
                folder: "chat-bottt"
            });
            finalImageUrl = uploadResponse.url;
        } catch (ikError) {
            console.error("ImageKit upload failed, falling back to direct URL. Error:", ikError.message || ikError);
        }

        const reply = {
            role: "assistant",
            content: finalImageUrl,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        };

        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

        return res.json({ success: true, reply });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
