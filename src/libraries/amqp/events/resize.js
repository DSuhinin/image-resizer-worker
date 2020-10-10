const path = require("path");
const debug = require("debug")("worker:events:resize");
const StoreModel = require("./../../../dao/models").StoreModel;
const AWS = require("aws-sdk");
const sharp = require("sharp");

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const STATUS_PROCESSING = 2;
const STATUS_READY = 3;

const handler = (data) => {
  StoreModel.findByPk(data.id)
    .then((item) => {
      debug(`change status to: ${STATUS_PROCESSING}`);
      item.status = STATUS_PROCESSING;
      return item.save();
    })
    .then((item) => {
      debug(`start image downloading`);
      s3.getObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: item.original,
      })
        .promise()
        .then((data) => {
          debug(`start image resizing`);
          return sharp(data.Body).resize(200, 300).toBuffer();
        })
        .then((data) => {
          debug(`start image uploading`);
          const thumb =
            path.parse(item.original).name +
            "_thumb" +
            path.parse(item.original).ext;
          return s3
            .upload({
              Key: thumb,
              Bucket: process.env.AWS_S3_BUCKET,
              Body: data,
            })
            .promise()
            .then(() => {
              debug(`change status to: ${STATUS_READY}`);
              item.thumb = thumb;
              item.status = STATUS_READY;
              return item.save();
            });
        });
    })
    .catch((error) => {
      debug(`error happened: ${error}`);
    });
};

module.exports = handler;
