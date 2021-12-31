import { MediaSeq } from '../../models';

const createMedia = async (data) => {
  return MediaSeq.bulkCreate(data)
};


const findOne = async (query) => {
  return MediaSeq.findOne({
    where: {
      ...query
    },
    raw: true
  });
};

const findById = async (id) => {
  return MediaSeq.findByPk(id, { raw: true });
};

export default {
  createMedia,
  findById,
  findOne
};
