import * as Nats from 'nats';
import * as uuid from 'uuid';

export class Transport {
  private _client: Nats.NatsConnection;
  public async connect() {
    try {
      this._client = await Nats.connect({
        servers: process.env.NATS_URI ?? 'nats://localhost:4222',
      });
      console.info('Connected to NATS');

    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
  public async disconnect() {
    this._client.close();
  }
  public async publish<Request = any, Response = any>(subject: string, req: Request): Promise<Response | undefined> {
    const reply = uuid.v4();
    const jc = Nats.JSONCodec()
    const data = jc.encode(req);

    this._client.publish(subject, data, { reply });
    const sub = this._client.subscribe(reply);
    for await (const msg of sub) {
      return jc.decode(msg.data) as Response;
    }
  }
  public async subscribe<Request = any, Response = any>(subject: string, handler: (data: Request) => Promise<Response>) {
    const jc = Nats.JSONCodec();
    const sub = this._client.subscribe(subject)
    for await (const msg of sub) {
      const data = jc.decode(msg.data) as Request;
      const result = await handler(data);
      this._client.publish(msg.reply!, jc.encode(result));
    }
  }
}
