'use strict';

const express = require('express')
const axios = require('axios');
const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


const api = 'https://bravobackend-gcp.uc.r.appspot.com/v1/';
const token = 'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxYzNiZGIzMi0wMTEzLTQ5ZGMtYjY5Ni1hNTIzOTNjMDU4NjMiLCJzdWIiOiJhbnRob255QGdtYWlsLmNvbSIsImV4cCI6MTYzNjk1NTAzNn0.eBpTh2zgOzqKTHY5ORwJIXloKeZiAtuqave2aM6H7eK45pRxEIoZruNe1dmtVgkc2ACU0xcoO5yCIQTHYVrXOg';
axios.defaults.headers.common.Authorization = `Bearer ${token}`;


app.post('/webhook', function (request, response) {

    function findAllHandler(agent) {
        let variable;
        const word = agent.parameters.word;
        console.log(word)
        axios.get(api + `${word}`, {
            timeout: 300000
        
        }).then((result) => {
            let resultText = ""
            result.data.forEach(element => {
                console.log(element);
                variable = element;
                
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
            console.log('prueba',variable);
        });
    }
    
    function saveStatusHandler(agent) {
        const status = agent.parameters.status;
        
        const res = axios.post(api + 'status', {
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
    
    function updateStatusHandler(agent) {
        const id = agent.parameters.id;
        const newName = agent.parameters.name;
        try {
            const res = axios.put(api + 'status', {
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
    
    function deleteStatusHandler(agent) {
        const id = agent.parameters.id;
        try {
            const res = axios.delete(api + 'status/' + id);
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

    switch(request.body.queryResult.intent.displayName){
        case 'findAll':
            console.log('findAll');
            findAllHandler(request.body.queryResult)
            break;
        case 'saveStatus':
            console.log('saveStatus');
            saveStatusHandler(request.body.queryResult)
            break;
        case 'updateStatus':
            console.log('updateStatus');
            updateStatusHandler(request.body.queryResult)
            break;
        case 'deleteStatus':
            console.log('deleteStatus');
            deleteStatusHandler(request.body.queryResult);
            break;
        default:
            console.log('No intent found');
            break;
    }

})

app.listen(3000, () => {
    console.log("Server running")
})
