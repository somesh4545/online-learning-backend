const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const axios = require("axios");

const storage = require("node-persist");

const personalizationForStudent = catchAsyncErrors(async (req, res) => {
  const studentID = req.userId;

  const body = req.body;

  let value = await storage.getItem(body.topic);

  if (value == null) {
    const client = axios.create({
      headers: {
        Authorization: `Bearer ${process.env.OPEN_AI}`,
      },
    });

    const params = {
      model: "text-davinci-003",
      prompt: `As an excellent teacher, you have the power to explain any topic in a way that a 12-year-old can understand. You'll be given a topic summary that you may not fully comprehend, and your job is to provide a simple explanation that even a child can grasp. If possible, please include an example to illustrate your point. If you're not familiar with the topic, simply return "false" \nHuman:${body.topic}\nAI:`,
      max_tokens: 300,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };

    client
      .post("https://api.openai.com/v1/completions", params)
      .then((response) => {
        var simplerExplanation = response.data.choices[0].text.trim();

        if (!simplerExplanation || simplerExplanation == "false") {
          return res.status(401).send({
            success: false,
            message: "failed to find simpler explanation",
          });
        }

        storage.setItem(body.topic, simplerExplanation);

        return res.status(201).send({
          success: true,
          message: "found simpler explanation from open ai",
          data: JSON.stringify({
            simplerExplanation: simplerExplanation,
            topic: body.topic,
          }),
        });
      })
      .catch((err) => {
        console.log(
          `${err.response.data.error.code} - ${err.response.data.error.message} `
        );
        return res.status(400).send({
          success: false,
          message: `${err.response.data.error.code} - ${err.response.data.error.message} `,
        });
      });
  } else {
    return res.status(201).send({
      success: true,
      message: "found simpler explanation from local storage",
      data: JSON.stringify({
        simplerExplanation: value,
        topic: body.topic,
      }),
    });
  }
});

const guidanceForTeacher = catchAsyncErrors(async (req, res) => {
  const teacherID = req.userId;

  const body = req.body;

  let value = await storage.getItem("teacher: " + body.topic);

  if (value == null) {
    const client = axios.create({
      headers: {
        Authorization: `Bearer ${process.env.OPEN_AI}`,
      },
    });

    const params = {
      model: "text-davinci-003",
      prompt: `As an AI mentor, you can assist teachers in enhancing their teaching techniques. Your role is to provide alternative explanations for topics that students may find challenging, and guide teachers on how to effectively communicate these concepts. When given a topic that students are struggling with, provide a clear and concise explanation that a teacher could use to enhance their lesson plan and guide the teacher. If you're not familiar with the topic, simply return "false" \nHuman:${body.topic}\nAI:`,
      max_tokens: 300,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };

    client
      .post("https://api.openai.com/v1/completions", params)
      .then((response) => {
        var simplerExplanation = response.data.choices[0].text.trim();

        if (!response || simplerExplanation == "false") {
          return res.status(401).send({
            success: false,
            message: "failed to find simpler explanation",
          });
        }

        storage.setItem("teacher: " + body.topic, simplerExplanation);

        return res.status(201).send({
          success: true,
          message: "found simpler guidance/explanation from open ai",
          data: JSON.stringify({
            simplerExplanation: simplerExplanation,
            topic: body.topic,
          }),
        });
      })
      .catch((err) => {
        console.log(
          `${err.response.data.error.code} - ${err.response.data.error.message} `
        );
        return res.status(400).send({
          success: false,
          message: `${err.response.data.error.code} - ${err.response.data.error.message} `,
        });
      });
  } else {
    return res.status(201).send({
      success: true,
      message: "found simpler guidance/explanation from local storage",
      data: JSON.stringify({
        simplerExplanation: value,
        topic: body.topic,
      }),
    });
  }
});

module.exports = {
  personalizationForStudent,
  guidanceForTeacher,
};
