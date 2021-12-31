import { map } from 'lodash'
import repo from './repository'
import config from './config';

const uploadImage = async (images = [], user = {}) => {
  const dataMedia = [];
  await map(images, async (image) => {
    const data = {
      type: config.mediaType.image,
      email: user.email,
      mimetype: image.mimetype,
      originalname: image.originalname
    }
    await map(image.transforms, async (transform) => {
      switch (transform.id) {
        case 'origin':
          data.origin = transform.location
          break;
        case 'feature':
          data.feature = transform.location
          break;
        case 'thumbnail':
          data.thumbnail = transform.location
          break;
        case 'avatar':
          data.avatar = transform.location
          break;
        default:
          break;
      }
    })
    await dataMedia.push(data)
  });

  return repo.createMedia(dataMedia);
}

const uploadDoc = async (doc = [], user = {}) => {
  const data = doc.map((m) => {
    return {
      type: m.mimetype && m.mimetype.includes('image') ? config.mediaType.image : config.mediaType.doc,
      email: user.email,
      location: m.location,
      mimetype: m.mimetype,
      originalname: m.originalname
    }
  })

  return repo.createMedia(data);
}

const index = async (request) => {
  return repo.findAll(request)
}

const show = async (id) => {
  return repo.findById(id)
}


export default {
  uploadImage,
  uploadDoc,
  index,
  show
}

