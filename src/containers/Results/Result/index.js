import React from 'react';
import { Link } from 'react-router-dom';
import AccessionIcon from '../../../common/icons/accession.svg';
import OrganismIcon from '../../../common/icons/organism.svg';
import SampleIcon from '../../../common/icons/sample.svg';
import './Result.scss';
import { formatSentenceCase, getMetadataFields } from '../../../common/helpers';
import DataSetSampleActions from '../../Experiment/DataSetSampleActions';
import TechnologyBadge, {
  MICROARRAY,
  RNA_SEQ
} from '../../../components/TechnologyBadge';

import * as routes from '../../../routes';

const Result = ({ result, addExperiment, removeExperiment, query }) => {
  const metadataFields = getMetadataFields(result);

  return (
    <div className="result">
      <div className="result__title-container">
        <div className="result__title-info">
          <div className="result__accession">
            <img
              src={AccessionIcon}
              className="result__icon"
              alt="accession-icon"
            />{' '}
            {result.accession_code}
          </div>
          <Link
            className="link result__title"
            to={routes.experiments(result.accession_code, {
              ref: 'search',
              result
            })}
          >
            {result.title || 'No title.'}
          </Link>
        </div>

        <DataSetSampleActions
          data={{
            // convert the `processed_samples` list into the object with sample fields that
            // `DataSetSampleActions` is expecting.
            [result.accession_code]: result.processed_samples.map(
              accession_code => ({
                accession_code,
                is_processed: true
              })
            )
          }}
        />
      </div>
      <ul className="result__stats">
        <li className="result__stat">
          <img
            src={OrganismIcon}
            className="result__icon"
            alt="organism-icon"
          />{' '}
          {result.organisms
            .map(organism => formatSentenceCase(organism))
            .join(',') || 'No species.'}
        </li>
        <li className="result__stat">
          <img src={SampleIcon} className="result__icon" alt="sample-icon" />{' '}
          {result.samples.length
            ? `${result.samples.length} Sample${
                result.samples.length > 1 ? 's' : null
              }`
            : null}
        </li>
        <li className="result__stat">
          <TechnologyBadge
            className="result__icon"
            isMicroarray={
              result.technologies && result.technologies.includes(MICROARRAY)
            }
            isRnaSeq={
              result.technologies && result.technologies.includes(RNA_SEQ)
            }
          />
          {result.pretty_platforms.filter(platform => !!platform).join(', ')}
        </li>
      </ul>

      <div className="result__details">
        <h3>Description</h3>
        <p className="result__paragraph">
          <HighlightedText text={result.description} higlight={query} />
        </p>
        <h3>Publication Title</h3>
        <p className="result__paragraph">
          {result.publication_title || (
            <i className="result__not-provided">No associated publication</i>
          )}
        </p>
        <h3>Sample Metadata Fields</h3>
        <p className="result__paragraph">
          {metadataFields && metadataFields.length ? (
            metadataFields.join(', ')
          ) : (
            <i className="result__not-provided">No sample metadata fields</i>
          )}
        </p>

        <Link
          className="button button--secondary"
          to={routes.experimentsSamples(result.accession_code, {
            ref: 'search',
            result
          })}
        >
          View Samples
        </Link>
      </div>
    </div>
  );
};

export default Result;

/**
 * Hightlight portions of a text.
 * thanks to https://stackoverflow.com/a/43235785/763705
 */
function HighlightedText({ text, higlight }) {
  if (!higlight) return text;

  // Split on higlight term and include term into parts, ignore case
  let parts = text.split(new RegExp(`(${higlight})`, 'gi'));
  return (
    <span>
      {' '}
      {parts.map((part, i) => (
        <span
          key={i}
          className={
            part && part.toLowerCase() === higlight.toLowerCase()
              ? 'text-highlight'
              : ''
          }
        >
          {part}
        </span>
      ))}{' '}
    </span>
  );
}
