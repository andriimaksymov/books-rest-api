import { model, Schema } from 'mongoose';

const tokenSchema = new Schema({
	user_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'user',
	},
	token: {
		type: String,
		required: true,
	},
	created_at: {
		type: Date,
		default: Date.now,
		expires: 3600,
	},
});

export default model('Token', tokenSchema);
