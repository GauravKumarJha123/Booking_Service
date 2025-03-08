/**
 * @swagger
 * /api/v1/booking:
 *   post:
 *     summary: Create a new booking
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - flightId
 *             properties:
 *               userId:
 *                 type: string
 *               flightId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully.
 *       500:
 *         description: Server error.
 */
 
// ... other endpoint annotations here