const axios = require('axios')

require('dotenv').config()

axios.defaults.headers.common.Authorization = `Bearer ${process.env.TELEGRAM_TOKEN}`

exports.findAllHandler = async (agent, response) => {
    try {
        const res = await axios.get(process.env.URI_API + `${ agent.parameters.word }`)
        
        let resultText = ""
        res.data.forEach(element => {
            console.log(element);
            resultText += "Name: " + element.name + '\n';
        });
        
        let resultArray = [
            {
                "text": {
                    "text": [
                        resultText + '\n'
                    ]
                }
            }
        ]
        response.send({"fulfillmentMessages": resultArray});
    } catch (error) {
        let errorMessage = [
            {
              "text": {
                "text": [
                    `Error with ` + agent.parameters.word + `. `
                ]
              }
            }
        ]
        response.send({"fulfillmentMessages": errorMessage});
    }

}

exports.saveStatusHandler = (agent, response) => {
    const status = agent.parameters.status;
    
    const res = axios.post(process.env.URI_API + 'status', {
    name: status
    });
    let resultArray = [
        {
          "text": {
            "text": [
                `The status ` + status + ` was created. `
            ]
          }
        }
    ]
    response.send({"fulfillmentMessages": resultArray});
}

exports.updateStatusHandler = (agent, response) => {
    const id = agent.parameters.id;
    const newName = agent.parameters.name;
    try {
        const res = axios.put(process.env.URI_API + 'status', {
            idStatus: id,
            name: "UPDATED - " + newName
        });
    } catch(error) {
        let resultText = 'The status ' + id + ' was not found. \n';
        let resultArray = [
            {
              "text": {
                "text": [
                    resultText
                ]
              }
            }
        ];
        response.send({"fulfillmentMessages": resultArray});
    }
    let resultText = 'The status with id ' + id + ' was updated. \n';
    let resultArray = [
        {
          "text": {
            "text": [
                resultText
            ]
          }
        }
    ];
    response.send({"fulfillmentMessages": resultArray});
}

exports.deleteStatusHandler = (agent, response) => {
    const id = agent.parameters.id;
    try {
        const res = axios.delete(process.env.URI_API + 'status/' + id);
    } catch(error) {
        let resultText = 'The status ' + id + ' was not found. ';
        let resultArray = [
            {
              "text": {
                "text": [
                    resultText
                ]
              }
            }
        ];
        response.send({"fulfillmentMessages": resultArray});
        console.log("This is an error");
    }
    let resultText = 'The status ' + id + ' was deleted. ';
    let resultArray = [
        {
          "text": {
            "text": [
                resultText
            ]
          }
        }
    ];
    response.send({"fulfillmentMessages": resultArray});
}