const axios = require("axios");
var endOfWeek = require('date-fns/endOfWeek');
var startOfWeek = require('date-fns/startOfWeek');
var server = 'http://localhost:8084/v1/'
var userID = 0;


require("dotenv").config();

exports.findAllHandler = async (agent, response) => {
  try {
    const res = await axios.get(
      server + `${agent.parameters.word}`
    );
    let resultText = "";
    res.data.forEach((element) => {
      console.log(element);
      resultText += "Name: " + element.name + "\n";
    });

    let resultArray = [
      {
        text: {
          text: [resultText + "\n"],
        },
      },
    ];
    response.send({ fulfillmentMessages: resultArray });
  } catch (error) {
    console.log(error);
    let errorMessage = [
      {
        text: {
          text: [`Error with ` + agent.parameters.word + `. `],
        },
      },
    ];
    response.send({ fulfillmentMessages: errorMessage });
  }
};

exports.saveStatusHandler = async (agent, response) => {
  const status = agent.parameters.status;
  try {
    const res = await axios.post(server + "status", {
      name: status,
    });
    console.log ('resposne from status save: ' + JSON.stringify(res.data));
    let resultArray = [
      {
        text: {
          text: [`The status ` + res.data + ` was created. `],
        },
      },
    ];
    response.send({ fulfillmentMessages: resultArray });
  } catch(error) {
    console.log(error);
    response.send({ fulfillmentMessages: 
      [
        {
          text: {
            text: [`${error.response.data.message}`],
          },
        },
      ] 
    });
  }
};

exports.updateStatusHandler = (agent, response) => {
  const id = agent.parameters.id;
  const newName = agent.parameters.name;
  try {
    const res = axios.put(server + "status", {
      idStatus: id,
      name: "UPDATED - " + newName,
    });
  } catch (error) {
    let resultText = "The status " + id + " was not found. \n";
    let resultArray = [
      {
        text: {
          text: [resultText],
        },
      },
    ];
    response.send({ fulfillmentMessages: resultArray });
  }
  let resultText = "The status with id " + id + " was updated. \n";
  let resultArray = [
    {
      text: {
        text: [resultText],
      },
    },
  ];
  response.send({ fulfillmentMessages: resultArray });
};

exports.deleteStatusHandler = (agent, response) => {
  const id = agent.parameters.id;
  try {
    const res = axios.delete(server + "status/" + id);
  } catch (error) {
    let resultText = "The status " + id + " was not found. ";
    let resultArray = [
      {
        text: {
          text: [resultText],
        },
      },
    ];
    response.send({ fulfillmentMessages: resultArray });
    console.log("This is an error");
  }
  let resultText = "The status " + id + " was deleted. ";
  let resultArray = [
    {
      text: {
        text: [resultText],
      },
    },
  ];
  response.send({ fulfillmentMessages: resultArray });
};

exports.login = async (agent, response) => {
    const username = agent.parameters.User;
    const password = agent.parameters.Password;
    try {
        const res = await axios.post(server + 'users/login', {
            username: username,
            password: password
        });
        console.log(res.headers.authorization);
        axios.defaults.headers.common.Authorization = res.headers.authorization
        userID = res.headers.iduser;
        let resultArray = [
        {
            text: {
            text: 
            
            ['User ' + username + " has been logged in successfully."],
            },
        },
        ];
        response.send({ fulfillmentMessages: resultArray });
    } catch(error){
        console.log(error);
        let resultArray = [
            {
                text: {
                text: [`Error with login of user ` + agent.parameters.User],
                },
            },
            ];
        response.send({ fulfillmentMessages: resultArray });
    }
  };

exports.createTimesheetHandler = async (agent, response) => {
  const timeSheet = agent.parameters.timesheet;
  const endWeek = endOfWeek(new Date(), { weekStartsOn: 0 });
  const startWeek = startOfWeek(new Date(), { weekStartsOn: 0 });
  try{ 
    const timesheetData = {
      "startPeriod": startWeek,
      "endPeriod": endWeek,
      "status": {
          "idStatus": 9
      },
      "user": {
          "idUser": userID
      }
    }

    const res = await axios.post(server + 'timesheets', timesheetData);
    console.log(JSON.stringify('response from creation: ' + JSON.stringify(res.data)));
    let resultArray = [
      {
        text: {
          text: [`Timesheet of ID ${res.data.idTimesheet} has been created`],
        },
      },
    ];
    response.send({ fulfillmentMessages: resultArray });

  } catch(error) {
    console.log(error.response)
    response.send({ fulfillmentMessages: 
      [
        {
          text: {
            text: [`${error.response.data.message}`],
          },
        },
      ] 
    });
  }
};
