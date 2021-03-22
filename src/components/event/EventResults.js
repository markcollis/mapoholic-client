import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import memoize from 'memoize-one';

import Collapse from '../generic/Collapse';
import FileDropzone from '../generic/FileDropzone';
import Table from '../generic/Table';
import { TEMPLATE } from '../../common/fileData';

// The EventResults component renders the results of a runner's course and provides
// an interface for removing and uploading new results.
class EventResults extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    requestRefreshCollapse: PropTypes.func.isRequired,
    selectedEvent: PropTypes.objectOf(PropTypes.any),
    selectedRunner: PropTypes.string,
    updateEventRunner: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedEvent: {},
    selectedRunner: '',
  };

  state = {
    isEditing: false,
    uploadedResults: null,
  };

  getRunnerData = memoize((selectedEvent, selectedRunner) => {
    const { runners } = selectedEvent;
    if (!runners) return null;
    const runnerData = runners.find(({ user }) => {
      const { _id: runnerId } = user;
      return runnerId === selectedRunner;
    });
    return runnerData;
  });

  convertToCSV = (resultsArray) => { // array of objects with the same set of fields
    if (typeof resultsArray !== 'object') return null;
    const headerArray = [];
    // header first
    const fields = Object.keys(resultsArray[0]);
    fields.forEach((field) => headerArray.push(`"${field}"`));
    const header = headerArray.join().concat('\r\n');
    // then data for each runner
    const runnerArray = resultsArray.map((line) => {
      const lineArray = [];
      fields.forEach((field) => lineArray.push(`"${line[field].replace(/"/g, '""')}"`));
      const lineOutput = lineArray.join();
      return lineOutput;
    });
    const runners = runnerArray.join('\r\n');
    const output = header.concat(runners).concat('\r\n');
    return output;
  };

  handleEditButtonClick = () => { // open edit panel
    this.setState({ isEditing: true });
  };

  handleCancelButtonClick = () => { // close edit panel, reset anything uploaded
    this.setState({ isEditing: false, uploadedResults: null });
  }

  handleOnloadCSV = (e) => { // parse uploaded CSV file and store in uploadedResults
    const contents = e.target.result;
    const uploadedResults = [];
    const lines = contents.split('\n');
    const header = lines[0].split(',').map((field) => field.replace(/"/g, '').trim());
    const numberFields = header.length;
    for (let i = 1; i < lines.length; i += 1) {
      const result = {};
      const line = lines[i].split(',').map((field) => field.replace(/"/g, '').trim());
      if (line.length === numberFields) { // ignore incomplete lines
        for (let j = 0; j < header.length; j += 1) {
          result[header[j]] = line[j];
        }
        uploadedResults.push(result);
      }
    }
    // console.log('uploadedResults parsed:', uploadedResults);
    this.setState({ uploadedResults });
  };

  handleOnloadJSON = (e) => { // parse uploaded CSV file and store in uploadedResults
    const contents = e.target.result;
    const uploadedResults = [];
    const rawUploadedResults = JSON.parse(contents);
    // console.log('uploadedResults parsed:', rawUploadedResults);
    if (Array.isArray(rawUploadedResults)) { // process array in required format
      rawUploadedResults.forEach((result) => {
        const {
          place,
          sort,
          name,
          regNumber,
          clubShort,
          club,
          time,
          loss,
        } = result;
        const resultToUpload = {
          place: place || '',
          sort: sort || '',
          name: name || '',
          regNumber: regNumber || '',
          clubShort: clubShort || '',
          club: club || '',
          time: time || '',
          loss: loss || '',
        };
        uploadedResults.push(resultToUpload);
      });
    } else if (rawUploadedResults.Method === 'getEventResults') { // process ORIS data
      const { Data: orisData } = rawUploadedResults;
      const classResultsData = Object.keys(orisData).map((resultKey) => orisData[resultKey]);
      classResultsData.forEach((result) => {
        const {
          Place: place,
          Sort: sort,
          Name: name,
          RegNo: regNumber,
          ClubNameResults: club,
          Time: time,
          Loss: loss,
        } = result;
        const resultToUpload = {
          place,
          sort,
          name,
          regNumber,
          clubShort: regNumber.slice(0, 3),
          club,
          time,
          loss,
        };
        uploadedResults.push(resultToUpload);
      });
    }
    this.setState({ uploadedResults });
  };

  handleFileAdded = (file) => { // check file type and handle accordingly
    // console.log('file added:', file);
    const readFile = new FileReader();
    if (file.type === 'application/json') {
      readFile.onload = this.handleOnloadJSON;
    }
    if (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel') {
      readFile.onload = this.handleOnloadCSV;
    }
    readFile.readAsText(file);
  };

  handleSaveResultsButtonClick = () => { // updateEventRunner with new results
    const { selectedEvent, selectedRunner, updateEventRunner } = this.props;
    const { _id: eventId } = selectedEvent;
    const { uploadedResults } = this.state;
    if (eventId && selectedRunner && uploadedResults) {
      const runnerData = this.getRunnerData(selectedEvent, selectedRunner);
      const { user } = runnerData;
      const { regNumber } = user;
      const ownResult = uploadedResults.find((result) => result.regNumber === regNumber);
      const fieldSize = uploadedResults.length - 1;

      const valuesToSubmit = { fieldSize, fullResults: uploadedResults };
      if (ownResult) {
        const { place, time, loss } = ownResult;
        valuesToSubmit.place = place;
        valuesToSubmit.time = time;
        valuesToSubmit.timeBehind = loss;
      }
      updateEventRunner(eventId, selectedRunner, valuesToSubmit, (didSucceed) => {
        if (didSucceed) {
          this.setState({ isEditing: false, uploadedResults: null });
        }
      });
    }
  };

  renderResultsTable = (resultSet, regNumberArray = []) => {
    const { language, requestRefreshCollapse } = this.props;
    const tableHead = ['', <Trans>Name</Trans>, <Trans>Club</Trans>, <Trans>Time</Trans>, <Trans>Behind</Trans>];
    const tableData = [...resultSet]
      .sort((a, b) => parseInt(a.sort, 10) - parseInt(b.sort, 10))
      .map((result) => {
        const {
          place,
          name,
          regNumber,
          clubShort,
          time,
          loss,
        } = result;
        return {
          highlightRow: regNumberArray.includes(regNumber),
          rowData: [
            { render: place },
            { render: name },
            { render: clubShort },
            { render: time },
            { render: loss },
          ],
        };
      });
    return (
      <Table
        language={language}
        requestRefreshCollapse={requestRefreshCollapse}
        showPagination={false}
        tableHead={tableHead}
        tableData={tableData}
      />
    );
  };

  renderEditPanel = (existingResults, selectedEvent, courseTitle) => {
    const { uploadedResults } = this.state;
    const { name, date, orisId } = selectedEvent;
    const downloadName = (existingResults)
      ? name.replace(/\s/g, '').concat(date)
      : 'ResultsTemplate';
    const downloadBlobJSON = new Blob([JSON.stringify(existingResults || TEMPLATE)],
      { type: 'application/json' });
    const downloadUrlJSON = window.URL.createObjectURL(downloadBlobJSON);
    const downloadJSON = (
      <a
        download={`${downloadName}.json`}
        href={downloadUrlJSON}
      >
        JSON
      </a>
    );
    const downloadBlobCSV = new Blob([this.convertToCSV(existingResults || TEMPLATE)],
      { type: 'text/csv' });
    const downloadUrlCSV = window.URL.createObjectURL(downloadBlobCSV);
    const downloadCSV = (
      <a
        download={`${downloadName}.csv`}
        href={downloadUrlCSV}
      >
        CSV
      </a>
    );
    const downloadDescription = (existingResults)
      ? (
        <p>
          <Trans>
            To amend results, you need to download them (in either CSV or JSON
            format), make whatever changes you want using a text editor or spreadsheet*,
            then re-upload them to replace the existing results. (*LibreOffice or Google
            Sheets provide better support for CSV import and export than MS Excel)
          </Trans>
        </p>
      )
      : (
        <p>
          <Trans>
            You can upload full results for your course/class in either CSV format
            (exported from a spreadsheet) or JSON format if you are producing them
            programatically. If you download one of the following templates you
            will see what fields are required.
          </Trans>
        </p>
      );
    const downloadLinks = (existingResults)
      ? <p><Trans>{`Download current results: ${downloadCSV} ${downloadJSON}`}</Trans></p>
      : <p><Trans>{`Download results template: ${downloadCSV} ${downloadJSON}`}</Trans></p>;
    const dropzoneIcon = <i className="file alternate outline big icon" />;
    const dropzoneText = (
      <div>
        <Trans>
          Select your JSON or CSV results file (drag and drop or click to open file dialogue).
        </Trans>
      </div>
    );
    const orisLink = (orisId && orisId !== '')
      ? (
        <div className="row">
          <div className="column sixteen wide">
            <p>
              <Trans>
                As this event has an ORIS ID,&nbsp;
                <a
                  href={`https://oris.orientacnisporty.cz/API/?format=json&method=getEventResults&eventid=${orisId}&classname=${courseTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  results in JSON format
                </a>
                &nbsp;may be available and can be imported by downloading the file from ORIS
                and then uploading it here.
              </Trans>
            </p>
          </div>
        </div>
      )
      : '';
    return (
      <div className="ui grid middle aligned">
        <div className="row">
          <div className="column ten wide">
            <FileDropzone
              fileType="results"
              onFileAdded={(file) => this.handleFileAdded(file)}
              icon={dropzoneIcon}
              text={dropzoneText}
            />
          </div>
          <div className="column six wide">
            <p>
              <button
                disabled={!uploadedResults}
                type="button"
                className="ui tiny primary button fluid"
                onClick={this.handleSaveResultsButtonClick}
              >
                <Trans>Save Results</Trans>
              </button>
            </p>
            <p>
              <button
                type="button"
                className="ui right floated tiny button fluid"
                onClick={this.handleCancelButtonClick}
              >
                <Trans>Cancel</Trans>
              </button>
            </p>
          </div>
        </div>
        <div className="row">
          <div className="column sixteen wide">
            {downloadDescription}
            {downloadLinks}
          </div>
        </div>
        {orisLink}
      </div>
    );
  };

  render() {
    const { isEditing, uploadedResults } = this.state;
    const { selectedEvent, selectedRunner } = this.props;
    const runnerData = this.getRunnerData(selectedEvent, selectedRunner);
    if (!runnerData) return null;
    const {
      courseTitle,
      courseLength,
      courseClimb,
      fullResults,
      user,
    } = runnerData;
    const { regNumber } = user;
    const regNumberArray = [regNumber]; // potential to add others of interest later
    const existingResults = (fullResults && fullResults.length > 0) ? fullResults : null;
    const resultsToShow = uploadedResults || existingResults;

    const editButtonText = (existingResults)
      ? <Trans>Edit Results</Trans> : <Trans>Add Results</Trans>;
    const editButton = (
      <button
        type="button"
        disabled={isEditing}
        className="ui tiny button primary right floated"
        onClick={this.handleEditButtonClick}
      >
        {editButtonText}
      </button>
    );
    const courseHeadingArray = [];
    if (courseTitle) courseHeadingArray.push(courseTitle);
    if (courseLength) {
      if (courseClimb) courseHeadingArray.push(`(${courseLength}km, ${courseClimb}m)`);
      else courseHeadingArray.push(`(${courseLength}km)`);
    }
    const courseHeading = (courseHeadingArray.length > 0)
      ? <h4>{courseHeadingArray.join('')}</h4>
      : '';

    const title = <Trans>Results</Trans>;
    return (
      <div className="ui segment">
        <Collapse title={title}>
          {(isEditing)
            ? this.renderEditPanel(existingResults, selectedEvent, courseTitle)
            : editButton}
          {(resultsToShow) ? courseHeading : ''}
          {(resultsToShow) ? this.renderResultsTable(resultsToShow, regNumberArray) : ''}
        </Collapse>
      </div>
    );
  }
}

export default EventResults;
