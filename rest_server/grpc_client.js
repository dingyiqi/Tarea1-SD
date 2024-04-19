const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./base.proto";
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const Search = grpc.loadPackageDefinition(packageDefinition).Search;
const client = new Search( process.env.GRPC_SERVER + ":50051", grpc.credentials.createInsecure());

module.exports = client;