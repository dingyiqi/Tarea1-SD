const express = require("express");
const grpc = require("./grpc_client");
const rd = require("./redis");

const port = 8080;
const app = express();

app.use(express.json());

app.get("/search/:item", async (req, res) => {
    const { item } = req.params;
    if (item) {
      rd.get(item, function (err, reply){
        if (reply){
          res.json(JSON.parse(reply));
        } else{
          grpc.getData({message: item}, (error, data) => {
            console.log("Reponse: ", data)
            if (error){
              console.log(error);
              res.json({});
            } else {
              rd.set(item, JSON.stringify(data.data));
              res.json(data.data)
            }
          });
        }
      });
    }
  });

app.listen(port, () => {
    console.log(`API RUN AT http://localhost:${port}`);
});