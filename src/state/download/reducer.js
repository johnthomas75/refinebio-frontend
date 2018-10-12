import union from 'lodash/union';

const initialState = {
  dataSetId: null,
  dataSet: {},
  experiments: {},
  samples: {},
  isLoading: false,
  areDetailsFetched: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'DOWNLOAD_DATASET_FETCH': {
      const { dataSetId } = action.data;
      return {
        ...state,
        dataSetId
      };
    }
    case 'DOWNLOAD_DATASET_FETCH_SUCCESS': {
      const {
        dataSet,
        is_processing,
        is_processed,
        aggregate_by,
        scale_by,
        expires_on
      } = action.data;
      return {
        ...state,
        dataSet,
        is_processing,
        is_processed,
        aggregate_by,
        scale_by,
        expires_on
      };
    }
    case 'DOWNLOAD_ADD_EXPERIMENT_SUCCESS': {
      const { dataSetId, dataSet } = action.data;
      return {
        ...state,
        dataSetId,
        dataSet
      };
    }
    case 'DOWNLOAD_UPDATE_DATASET': {
      const { dataSet } = action.data;
      return {
        ...state,
        dataSet
      };
    }
    case 'DOWNLOAD_FETCH_DETAILS': {
      const { dataSetId } = action.data;
      return {
        ...state,
        dataSetId
      };
    }
    case 'DOWNLOAD_FETCH_DETAILS_SUCCESS': {
      const {
        dataSet,
        is_processing,
        is_processed,
        aggregate_by,
        scale_by,
        samples,
        experiments
      } = action.data;
      return {
        ...state,
        dataSet,
        is_processing,
        is_processed,
        aggregate_by,
        scale_by,
        samples,
        experiments
      };
    }
    case 'DOWNLOAD_CLEAR': {
      return {
        ...state,
        dataSetId: null,
        dataSet: {}
      };
    }

    default:
      return state;
  }
};

// Returns the dataset id stored in the state.
export const getDataSetId = state => state.download && state.download.dataSetId;

/**
 *
 * @param {*} samples contains detailed information about the samples in the dataset
 * @param {*} dataSet
 */
export function groupSamplesBySpecies({ dataSet, samples }) {
  if (!dataSet || !samples) return {};
  let species = {};

  for (let experimentAccessionCode of Object.keys(dataSet)) {
    if (!Object.keys(samples).length || !samples[experimentAccessionCode]) {
      continue;
    }
    const experimentSamples = dataSet[experimentAccessionCode];
    if (!experimentSamples || !experimentSamples.length) continue;

    for (let addedSampleAccessionCode of experimentSamples) {
      const sample = samples[experimentAccessionCode].find(
        sample => sample.accession_code === addedSampleAccessionCode
      );

      const {
        organism: { name: organismName }
      } = sample;
      if (!species[organismName]) {
        species[organismName] = [];
      }

      const modifiedSample = { ...sample, experimentAccessionCode };
      species[organismName].push(modifiedSample);
    }
  }

  return species;
}

export function getExperimentCountBySpecies({ experiments, dataSet }) {
  if (!dataSet || !experiments) return {};
  const species = {};
  for (let accessionCode of Object.keys(dataSet)) {
    const experimentInfo = experiments[accessionCode];
    if (!experimentInfo) return {};

    const { organisms } = experimentInfo;
    for (let organism of organisms) {
      if (!species[organism]) species[organism] = 0;
      species[organism]++;
    }
  }

  return species;
}

export function getTotalSamplesAdded({ dataSet }) {
  if (!dataSet) return 0;
  return union(...Object.values(dataSet)).length;
}

export function getTotalExperimentsAdded({ dataSet }) {
  if (!dataSet) return 0;
  return Object.keys(dataSet).length;
}
