import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

// The HomeAboutAuthor component renders a brief profile of the author
const HomeAboutAuthor = ({ language }) => {
  const linkMark = (
    <a
      href="https://markcollis.dev"
      target="_blank"
      rel="noopener noreferrer"
    >
    Mark Collis
    </a>
  );
  const linkDKP = (
    <a
      href={(language === 'cs') ? 'http://obkotlarka.cz/cz/home/' : 'http://obkotlarka.cz/en/home/'}
      target="_blank"
      rel="noopener noreferrer"
    >
    OOB Kotlářka
    </a>
  );
  const linkDRONGO = (
    <a
      href="https://new.drongo.org.uk/"
      target="_blank"
      rel="noopener noreferrer"
    >
    DrongO
    </a>
  );
  const linkORIS = (
    <a
      href="https://oris.orientacnisporty.cz/"
      target="_blank"
      rel="noopener noreferrer"
    >
    ORIS
    </a>
  );
  const linkReact = (
    <a
      href="https://reactjs.org/"
      target="_blank"
      rel="noopener noreferrer"
    >
    React
    </a>
  );
  const linkRedux = (
    <a
      href="https://redux.js.org/"
      target="_blank"
      rel="noopener noreferrer"
    >
    Redux
    </a>
  );
  const linkNode = (
    <a
      href="https://nodejs.org/"
      target="_blank"
      rel="noopener noreferrer"
    >
    Node.js
    </a>
  );
  const linkExpress = (
    <a
      href="https://expressjs.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
    Express
    </a>
  );
  const linkMongo = (
    <a
      href="https://www.mongodb.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
    MongoDB
    </a>
  );
  const linkGithubClient = (
    <a
      href="https://github.com/markcollis/mapoholic-client/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Trans>client</Trans>
    </a>
  );
  const linkGithubServer = (
    <a
      href="https://github.com/markcollis/mapoholic-server/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Trans>server</Trans>
    </a>
  );

  return (
    <div className="ui segment">
      <h3><Trans>About me</Trans></h3>
      <p>
        <Trans>
          MapOholic has been, and is still being, developed by
          {`${linkMark}.`}
          I am a British orienteer living in Prague and a member of
          {linkDKP}
          and
          {`${linkDRONGO},`}
          hence the integration with
          {linkORIS}
          * and the whole site being translated into Czech.
          (There are no technical reasons why it can&apos;t support other
          languages that I don&apos;t speak, if anyone out there would like to
          use a different language and is willing to do the translations!)
        </Trans>
      </p>
      <p><Trans>I developed MapOholic for two reasons:</Trans></p>
      <ul>
        <li>
          <Trans>
            It is a tool that I have often wished that I could have. Over 25 years&apos;
            worth of maps fills eight large ring binders and while it&apos;s a nice
            collection it is not always easy to find a map from a particular event,
            or of a particular area. These days details and results are all online,
            and routes are more commonly captured by a GPS tracker than drawn on the map.
            While I&apos;ve developed MapOholic to meet my own particular requirements
            and priorities, I hope others may find it useful too.
          </Trans>
        </li>
        <li>
          <Trans>
            It is also a practical demonstration of my full stack web development skills
            and I have produced it to both improve and showcase those skills through
            developing a solution to a real requirement.
            For the technically minded, the front end is based on
            {linkReact}
            and
            {`${linkRedux},`}
            the back end on
            {linkNode}
            and
            {linkExpress}
            with all the data (other than the image files) stored in
            {`${linkMongo}.`}
            Both are open source (ISC) and can be found on Github
            {`(${linkGithubClient}/${linkGithubServer})`}
            if you are interested.
          </Trans>
        </li>
      </ul>
      <p>
        <Trans>
          * Since you are reading the English version of the site, you may not know
          what ORIS is. It is the Czech Orienteering Federation portal that provides
          a common database for events, including handling entries, publishing results
          and producing rankings. All significant events in the Czech Republic are
          included, as are many smaller local ones. As an added bonus, there is a
          public API which exposes this data so that MapOholic can import and exploit it.
        </Trans>
      </p>
    </div>
  );
};

HomeAboutAuthor.propTypes = {
  language: PropTypes.string.isRequired,
};

export default HomeAboutAuthor;
