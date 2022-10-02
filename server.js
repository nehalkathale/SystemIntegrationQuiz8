const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const bodyParser = require('body-parser');
const db = require('./helper/databaseConnection');
const PORT = process.env.PORT || 3000;
const app = express();
const { validateUpdateStudent } = require('./helper/validator')
app.use(cors());
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description: "A simple Express Library API",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "My API Documentation",
            },
        ],
    },
    apis: ["./server.js"],
};
const specs = swaggerJsDoc(options);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())


/**
 * @swagger
 * components:
 *   schemas:
 *     Agents:
 *       type: object
 *       required:
 *         - AGENT_NAME
 *         - WORKING_AREA
 *         - COMMISSION
 *         - PHONE_NO
 *         - COUNTRY
 *       properties:
 *         AGENT_CODE:
 *           type: string
 *           description: The Auto-generated id of a agent
 *         AGENT_NAME:
 *           type: string
 *           description: Name of agent
 *         WORKING_AREA:
 *           type: string
 *           description: Working area of agent
 *         COMMISSION:
 *           type: integer
 *           description: Commission of agent
 *         PHONE_NO:
 *           type: long
 *           description: phone number of agent
 *         COUNTRY:
 *           type: string
 *           descripton: country of agent *
 *       example:
 *         AGENT_CODE: 1
 *         AGENT_NAME: Nil
 *         WORKING_AREA: Charlotte
 *         COMMISSION: 0.86
 *         PHONE_NO: 7374737484
 *         COUNTRY: USA
 *     Students:
 *       type: object
 *       required:
 *         - NAME
 *         - TITLE
 *         - CLASS
 *         - SECTION
 *         - ROLLID
 *       properties:
 *         NAME:
 *           type: string
 *           description: Name of student
 *         TITLE:
 *           type: string
 *           description: TITLE of student
 *         CLASS:
 *           type: string
 *           description: CLASS of student
 *         SECTION:
 *           type: string
 *           description: SECTION of student
 *         ROLLID:
 *           type: string
 *           description: ROLLID of student
 *
 */

/**
 * @swagger
 * /agents:
 *   get:
 *     summary: Returns all Agents
 *     responses:
 *       200:
 *         description: the list of the Agents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agents'
 */

app.get("/agents", async function (req, res) {
    try {
        let sqlQuery = 'SELECT * FROM agents';
        let rows = await db.pool.query(sqlQuery, req.params.id);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message)
    }
});


/**
 * @swagger
 * /agents/{id}:
 *   get:
 *     summary: gets agent by id
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of agent
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Agent found by its id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agents'
 *       400:
 *         description: Agent can not be found
 */

app.get("/agents/:id", async function (request, response) {
    let agentId = request.params.id;
    try {
        let agent = await db.pool.query("SELECT * FROM agents where AGENT_CODE = ?", [agentId]);
        if (agent) {
            response.status(200).json(agent);
        } else {
            response.sendStatus(404);
        }
    } catch (err) {
        throw err;
    }

});

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Returns all Students
 *     responses:
 *       200:
 *         description: the list of the Students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Students'
 */

app.get("/students", async function (req, res) {
    try {
        let sqlQuery = 'SELECT * FROM student';
        let rows = await db.pool.query(sqlQuery, req.params.id);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message)
    }
});

/**
 * @swagger
 *  /agents/{name}:
 *    delete:
 *      parameters:
 *        - in: path
 *          name: name
 *          description: delete agent by name
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: The agent was deleted
 *        404:
 *          description: The agent was not found
 *
 */
app.delete("/agents/:id", async function (request, response) {
    let agentName = request.params.id;
    try {
        let result = await db.pool.query("delete FROM agents where AGENT_NAME = ?", [agentName]);
        console.log(result);
        response.sendStatus(200);
    } catch (err) {
        throw err;
    }

});

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Students'
 *     responses:
 *       200:
 *         description: The Students record inserted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Students'
 *       500:
 *         description: Some server error
 */
app.post("/students", validateUpdateStudent, async function (request, response) {
    let student = request.body;
    console.log("Request body is", student)
    try {
        const result = await db.pool.query("insert into student (ROLLID,NAME,TITLE,CLASS,SECTION) values (?,?,?,?,?)", [Math.floor(Math.random() * (999 - 100 + 1) + 100), student.NAME, student.TITLE, student.CLASS, student.SECTION]);
        response.sendStatus(200);
    } catch (error) {
        response.sendStatus(400);
        throw error;
    }
})

/**
 * @swagger
 * /students:
 *   put:
 *     summary: update student record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Students'
 *     responses:
 *       200:
 *         description: The Students record inserted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Students'
 *       500:
 *         description: Some server error
 */
app.put("/students", async function (request, response) {
    let student = request.body;
    try {
        const result = await db.pool.query("update student set NAME = ? ,TITLE = ? ,CLASS = ? , SECTION = ? where ROLLID = ?", [student.NAME, student.TITLE, student.CLASS, student.SECTION, student.ROLLID]);
        response.sendStatus(200);
    } catch (error) {
        response.sendStatus(400);
        throw error;
    }
})

/**
 * @swagger
 * /agents/{id}:
 *   patch:
 *     summary: update agent records
 *     parameters:
 *       - in: path
 *         name: id
 *         description: delete agent by name
 *         required: true
 *         schema:
 *            type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Agents'
 *     responses:
 *       200:
 *         description: Update agent record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agents'
 *       500:
 *         description: Some server error
 */
app.patch("/agents/:id", async function (request, response) {
    let agent = request.body;
    let agent_id = request.params.id;
    console.log(agent_id)
    try {
        const result = await db.pool.query("update agents set AGENT_NAME = ? ,WORKING_AREA = ? ,COMMISSION = ? , PHONE_NO = ?, COUNTRY = ? where AGENT_CODE = ?", [agent.AGENT_NAME, agent.WORKING_AREA, agent.COMMISSION, agent.PHONE_NO, agent.COUNTRY, agent_id]);
        response.sendStatus(200);
    } catch (error) {
        response.sendStatus(400);
        throw error;
    }
})

app.listen(PORT, () => console.log(`Server runs on port ${PORT}`));