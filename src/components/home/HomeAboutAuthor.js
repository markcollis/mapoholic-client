import React from 'react';
import { Trans } from '@lingui/macro';
import Collapse from '../generic/Collapse';

const HomeAboutAuthor = () => {
  const title = <Trans>About me</Trans>;
  return (
    <div className="ui segment">
      <Collapse title={title}>
        <p><Trans>MapOholic was developed by...</Trans></p>
        <p><Trans>If you want to get in touch...</Trans></p>
      </Collapse>
    </div>
  );
};

export default HomeAboutAuthor;
