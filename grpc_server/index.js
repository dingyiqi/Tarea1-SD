const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./base.proto";
const protoLoader = require("@grpc/proto-loader");

const pool = require("./db");

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const dataProto = grpc.loadPackageDefinition(packageDefinition);

function main() {
  const server = new grpc.Server();
  server.addService(dataProto.Search.service, {
    getData: async (_, callback) => {
      const dataName = _.request.message;
      console.log("Request: ", dataName);
      const data = await pool.query("SELECT * FROM clima WHERE ciudad = $1::text", [dataName]);
      console.log("Response: ", data.rows);
      callback(null, { data: data.rows});
    }
  });
  server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err != null) console.log(err);
    else {
      console.log("gRPC run at http://localhost:50051");
      server.start();
    }
  });
}

main();