import { Request, Response } from "express";
import { existsSync } from "fs";
import path from "path";
import { imageResizing } from "../services/imageProcessing";

// getting all posts
const getImage = async (
	req: Request,
	res: Response
): Promise<void | Response> => {
	try {
		// get queries
		// const { filename, width, height } = req.query;
		// remove WhiteSpaces
		const filename = (req.query.filename as string).replace(/\s/g, "");
		const width = (req.query.width as string).replace(/\s/g, "");
		const height = (req.query.height as string).replace(/\s/g, "");

		// get source image path
		const sourcePath: string | undefined = path.resolve(
			`./images/full/${filename}`
		);
		// check if source image exists or throw error
		if (!existsSync(sourcePath)) {
			throw new Error(`Invalid input path: ${sourcePath}`);
		}

		// get the target image path
		// added width and height as user may need more dimensions for an image
		const targetPath: string | undefined = path.resolve(
			`./images/thumb/thumb_${width}_${height}_${filename}`
		);
		// if target image exist return image
		// else continue
		if (existsSync(targetPath)) {
			return res.status(200).sendFile(targetPath);
		}

		// resize image service
		const result = await imageResizing(
			sourcePath,
			targetPath,
			// parse string query to int
			parseInt(width as string, 10),
			// parse string query to int
			parseInt(height as string, 10)
		);

		if ("error" in result) {
			// if there are error throw
			throw result.error as Error;
		}
		// if no error return targetPath
		return res.status(200).sendFile(targetPath);
	} catch (error) {
		// check if instance of error not throw string but => throw new Error("")
		if (error instanceof Error) {
			return res.status(400).json({
				message: `${error.message}`
			});
		}
		// error is string
		return res.status(500).json({
			message: `${error}`
		});
	}
};

export { getImage };
