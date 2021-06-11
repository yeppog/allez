/**
 *
 *
 * @openapi
 * /api/videos/:filename:
 *   get:
 *     description: Retrieves the post for a given post slug.
 *     tags: [Video]
 *
 *     responses:
 *       "206":
 *         description: "Success."
 *         content:
 *           video/mp4:
 *             schema:
 *               type: string
 *               format: binary
 *
 *       "400":
 *         description: "Error finding file."
 *
 *
 *
 *       "403":
 *         description: "No files available"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "No files available"
 *       "404":
 *         description: "File found is not a video."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *               example:
 *                 message: "Not a video"
 *
 *
 *       "503":
 *         description: "Server is not available."
 */
