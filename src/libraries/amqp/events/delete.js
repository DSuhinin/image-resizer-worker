const debug = require("debug")("worker:events:delete");
const StoreModel = require("../../../dao/models").StoreModel;
const AWS = require("aws-sdk");

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const handler = (data) => {
  StoreModel.findByPk(data.id, { paranoid: false })
    .then((item) => {
      if (!item) {
        return debug(`item was not found with id: ${data.id}`);
      }

      debug(`item found: ${item}`);
      return Promise.all([
        s3
          .deleteObject({
            Key: item.original,
            Bucket: process.env.AWS_S3_BUCKET,
          })
          .promise(),
        s3
          .deleteObject({
            Key: item.thumb,
            Bucket: process.env.AWS_S3_BUCKET,
          })
          .promise(),
      ]);
    })
    .then((result) => {
      debug(`data was successfully removed from store`);
    })
    .catch((error) => {
      debug(`error happened while deleting an item: ${error}`);
    });
};

module.exports = handler;
