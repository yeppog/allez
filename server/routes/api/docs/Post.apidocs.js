/**
 * @openapi
 * /api/posts/getpost:
 *   get:
 *     description: Retrieves the post for a given post slug.
 *     tags: [Posts]
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         example:
 *           token: "c739b62c1141fbed21f597b37c6e2bf6"
 *     responses:
 *       "200":
 *         description: "Success"
 *
 * /api/posts/addComment:
 *   post:
 *     description: Adds a comment to a specified post.
 *     tags: [Posts]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddComment'
 *     responses:
 *       "200":
 *         description: "Success"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentSuccess'
 *       "400":
 *         description: "Bad request"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MissingBodyError'
 *       "403":
 *         description: "Unauthorised"
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/JWTTokenError'
 *                 - $ref: '#/components/schemas/PostFindError'
 *       default:
 *         description: "General error."
 *
 *
 *
 * /api/posts/deleteComment:
 *    post:
 *     description: Removes a specific comment by a specific user on a specific post.
 *     tags: [Posts]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteComment'
 *     responses:
 *       "200":
 *         description: "Success. Returns the post object after the comment has been removed"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentSuccess'
 *       "400":
 *         description: "Bad request"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MissingBodyError'
 *       "403":
 *         description: "Unauthorised"
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/JWTTokenError'
 *                 - $ref: '#/components/schemas/PostFindError'
 *       default:
 *         description: "General error."
 *
 * /api/posts/like:
 *    get:
 *      description: Toggles the like status of a user on a post. If the user has liked the post, remove the like relation. If the user hasn't liked the post, add a like relation.
 *      tags: [Posts]
 *      parameters:
 *      - in: header
 *        name: token
 *        schema:
 *          type: string
 *          description: The JWT token of the user making the request for authentication.
 *        example: "49057234r2f8b29f"
 *      - in: header
 *        name: slug
 *        schema:
 *          type: string
 *          description: The post slug of the post.
 *        example: "890ry2fub3f9234yf8034fh043"
 *      responses:
 *        "200":
 *          description: Success
 *        "403":
 *          description: Failure. Unable to find user or post based off the parameters given.
 *        "default":
 *          description: Server error.
 *
 * /api/posts/createPost:
 *    post:
 *      description: Create a post with an attached media file.
 *      tags: [Posts]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/CreatePost'
 *      responses:
 *        "200":
 *          description: "Success. Ok"
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/CreatePostSuccess"
 *        "400":
 *          description: "Bad request. Did not have the neccessary fields"
 *
 * 
 * /api/posts/editPost:
 *    post:
 *      description: Edit a given post with an optional attached media file.
 *      tags: [Posts]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/EditPost'
 *      responses:
 *        "200":
 *          description: "Success. Ok"
 *          content:
 *            application/json:
 *              schema:
 *                - $ref: "#/components/schemas/CreatePostSuccess"
 *        "400":
 *          description: "Bad request. Did not have the neccessary fields"
 * 
 * 
 * /api/posts/deletePost:
 *    post:
 *      description: Deletes a specific post and removes the related media.
 *      tags: [Posts]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              - $ref: "#/components/schemas/DeletePost"
 *      responses:
 *        "200":
 *          description: "Success. Returns the user data without the deleted post."
 *          content:
 *            application/json:
 *              schema:
 *                - $ref: "#/components/schemas/CreatePostSuccess"
 *        "400":
 *          description: "Bad request. Did not have the neccessary fields"
 * 
 * /api/posts/addCommentToComment:
 *    post:
 *      description: Takes a comment and adds a new comment to it.
 *      tags: [Posts]
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              - $ref: "#/components/schemas/addCommentToComment"
 * 
 *      responses:
 *        "200":
 *          description: "Success. Added teh comment to the comment. Returns the updated comment."
 *          content:
 *            application/json:
 *              schema:
 *                - $ref: "#/components/schemas/AddCommentToCommentSuccess"
 *        "400":
 *          description: "Bad request. Missing fields."
 *        "403":
 *          description: "Bad JWT Token."
 * 
 * 
 * /api/posts/addCommentToPost:
 *    post:
 *      description: "Adds a comment to a post."
 *      tags: [Posts]
 *      requestBody:
 *        application/json:
 *          schema:
 *            - $ref: "#/components/schemas/AddCommentToPost"
 *      responses:
 *        "200":
 *          description: "Success."
 *        "400":
 *          description: "Bad request. Missing token."
 * 
 * /api/posts/fetchFollowPosts:
 *    post:
 *      description: "Fetches the posts from the users following for a specified date range."
 *      tags: [Posts]
 *      requestBody:
 *        application/json:
 *          schema:
 *            - $ref: "#/components/schemas/FetchFollowPosts"
 * 
 *      responses:
 *        "200":
 *          description: "Success. Returns the object of posts."
 *        "400":
 *          description: "Bad request. Missing token or neccessary fields."
 *  
 * 
 *
 * components:
 *    schemas:
 *      CreatePost:
 *        type: object
 *        required:
 *          - body
 *          - token
 *          - file
 *          - tag
 *        properties:
 *          token:
 *            type: string
 *            description: JWT token of the user creating the post.
 *          body:
 *            type: string
 *            description: The text content of the post.
 *          file:
 *            type: string
 *            format: binary
 *            description: The file that is to be uploaded (jpeg/png/mp4)
 *          tag:
 *            type: array
 *            items:
 *              type: string
 *              description: Object references of tagged objects (users or gyms)
 *            description: The array of object references of tagged objects
 *        example:
 *          body: "This is the body of the post!"
 *          token: "3490r203fhefher89ehwfuewbf923ghr23fn"
 *          file: "This is a png image"
 *          tag: ["user1", "gym1"]
 *
 *      CreatePostSuccess:
 *        type: object
 *        properties:
 *          mediaPath:
 *            type: string
 *            description: The path of the media that was uploaded.
 *          likes:
 *            type: number
 *            description: The total number of likes on the post.
 *          likedUsers:
 *            type: object
 *            description: The users who liked the post as the key, the date liked as the value.
 *          comments:
 *            type: array
 *            items:
 *              type: string
 *              description: ObjectID of the comments that are related to the post.
 *
 *          createdAt:
 *            type: string
 *            description: The time and date the post was created.
 *          userId:
 *            type: string
 *            description: The ID of the user that created the post.
 *          body:
 *            type: string
 *            description: The contents of the post body
 *          avatarPath:
 *            type: string
 *            description: The URL to render the user's avatar.
 *          slug:
 *            type: string
 *            description: The unique post slug of the post.
 *      EditPost:
 *        type: object
 *        required:
 *          - token
 *        properties:
 *          token:
 *            type: string
 *            description: JWT token of the user.
 *          body:
 *            type: string    
 *            description: The body of the post.
 *          file:
 *            type: string
 *            format: binary
 *        example:
 *          token: "fef38hf943f34fj4f"
 *          body: "This is the post body."
 *          file: "The file uploaded"
 * 
 * 
 *      AddComment:
 *        type: object
 *        required:
 *          - token
 *          - comment
 *          - slug
 *        properties:
 *          token:
 *            type: string
 *          comment:
 *            type: string
 *          slug:
 *            type: string
 *        example:
 *          token: "e9ri24fh23908f23f"
 *          comment: "This is a comment."
 *          slug: "e49fu23094fn23890fj3290fj"
 *      DeleteComment:
 *        type: object
 *        required:
 *          - token
 *          - date
 *          - slug
 *        properties:
 *          token:
 *            type: string
 *          date:
 *            type: string
 *          slug:
 *            type: string
 *        example:
 *          token: "r9u234f023hf3mf23t"
 *          date: "2021-06-12T11:11:01.967Z"
 *          slug: "fiojn3489fh34f0bn34f"
 *      CommentSuccess:
 *        type: object
 *        properties:
 *          mediaPath:
 *            type: string
 *            description: URL for the attached content.
 *          likes:
 *            type: number
 *            description: The number of likes the post has.
 *          likedUsers:
 *            type: array
 *            description: The users who liked the post.
 *            items:
 *              type: string
 *              description: The username of the user who liked the post.
 *          comments:
 *            type: array
 *            description: The comments the post has
 *            items:
 *              type: object
 *              description: A single comment
 *              properties:
 *                date:
 *                  type: string
 *                  description: The date the comment was made.
 *                user:
 *                  type: string
 *                  description: The username of the user that made the comment
 *                body:
 *                  type: string
 *                  description: The comment
 *          createdAt:
 *            type: string
 *            description: The date the post was made
 *          _id:
 *            type: string
 *            description: The post ID.
 *          userId:
 *            type: string
 *            description: The object ID of the user who made the post.
 *          body:
 *            type: string
 *            description: The body of the post
 *          avatarPath:
 *            type: string
 *            description: The URL of the user avatar of the user that made the post.
 *          slug:
 *            type: string
 *            description: The URL slug for the post.
 *        example:
 *          mediaPath: "http://test.com/api/videos/video_348ry230rfh230f3.mp4"
 *          likes: 0
 *          likedUsers: ["d23f23f32f", '4fihj2349f8h34g']
 *          comments: [{date: "2021-06-12T11:47:15.208Z", user: "yeet", body: "This is a comment"}]
 *          createdAt: "2021-06-12T11:47:15.208Z"
 *          _id: "d082hf823hf23f32f"
 *          userId: "409fh304fn23od32df23"
 *          username: "username"
 *          body: "This is the post body"
 *          avatarPath: "http://test.com/api/avatar/avatar_of_username.png"
 *          slug: "0t94h034hgf0349hgpostslug"
 *      MissingBodyError:
 *        type: object
 *        properties:
 *          message:
 *            type: string
 *            description: The description of the error
 *        example:
 *          message: "Bad request. User token and body slug must be present."
 *      JWTTokenError:
 *        type: object
 *        properties:
 *          message:
 *            type: string
 *            description: The description of the error. JWT error.
 *        example:
 *          message: "Token has expired"
 *      PostFindError:
 *        type: object
 *        properties:
 *          message:
 *            type: string
 *            description: The description of the error. Unable to find the post from the slug.
 *        example:
 *          message: "Unable to find post"
 *      
 *
 *
 *
 */
