import { Injectable } from "@angular/core";
import * as Kinessis from "aws-sdk/clients/kinesis";
import { BehaviorSubject } from 'rxjs';

declare var _: any;

@Injectable({
    providedIn: "root"
})
export class KinesisService {
    kinesis = new Kinessis({
        credentials: {
            accessKeyId: "<ACCESS_KEY>",
            secretAccessKey: "<SECRET_KEY>"
        },
        region: "us-east-2"
    });
    public dataTemp = new BehaviorSubject({});
    public dataHumidity = new BehaviorSubject({});
    constructor(){
        this.getData()
    }

    getData() {
        let streamName ='kig4-ra' 
        this.kinesis.describeStream(
            { StreamName: streamName },
            (err, data: any) => {
                let hola = this;
                if (err) {
                    console.log(err);
                    return;
                }
                if (_.size(data.StreamDescription.Shards > 1)) {
                    console.log(
                        "WARNING: this demo was designed to work with a single Kinesis shard"
                    );
                }

                // now get the Stream's shardIterator and start getting records in a loop
                this.kinesis.getShardIterator(
                    {
                        StreamName: streamName,
                        ShardId: data.StreamDescription.Shards[0].ShardId,
                        ShardIteratorType: "LATEST"
                    },
                    hola.getRecord
                );
            }
        );
    }

    getRecord = (err, data: any)=>{
        if (err) {
            console.log(err);
            return;
        }
        let any = this
        this.kinesis.getRecords(
            { ShardIterator: data.ShardIterator, Limit: 100 },
            (err, data: any)=>{
                if (err) {
                    console.log(err);
                    return;
                }
                for (var record in data.Records as any) {
                    let decodedData = new TextDecoder().decode(data.Records[record].Data);
                    let datum = JSON.parse(decodedData);

                    console.log(datum.temperature)
                    any.dataTemp.next(datum.temperature)
                    any.dataHumidity.next(datum.humidity)
                }

                setTimeout(function() {
                  data.ShardIterator = data.NextShardIterator;
                  any.getRecord(null, data);
                }, 500);
            }
        );
    }
}
