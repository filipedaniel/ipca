const mongoose = require('mongoose');


/* MongoDB Schema for store 'Publication Metadata' */ 
const publicationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  identifier: { type: String, required: true },
  datestamp: { type: Date, required: true },
  metadata: {
    title: { type: String },
    creator: [ { type: String } ],
    subject: [ { type: String } ],
    description: [ { type: String } ],
    identifier: [ { type: String } ],
    publisher: [ { type: String } ],
    contributor: [ { type: String } ],
    date: [ { type: String } ],
    type: { type: String },
    format: { type: String },
    lang: { type: String },
    rights: { type: String },
  },
  data_provider: {
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true }
  }
});


publicationSchema.index( { 
  "identifier": "text",
  "metadata.creator": "text",
  "metadata.title": "text",
  "metadata.subject": "text",
  "metadata.description": "text",
  "metadata.identifier": "text",
  "metadata.publisher": "text",
  "metadata.contributor": "text",
  "metadata.date": "text",
  "metadata.type": "text",
  "metadata.format": "text",
  "metadata.lang": "text",
  "metadata.rights": "text",
  "data_provider.name": "text",
  "data_provider.url": "text"
},{ name: 'publication_index' });
 
module.exports = mongoose.model('Publication', publicationSchema);