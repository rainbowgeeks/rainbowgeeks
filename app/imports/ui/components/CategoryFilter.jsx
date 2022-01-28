import React from 'react';
import { Card } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

const items = [
  {
    header: 'Project Report - April',
    description:
      'Leverage agile frameworks to provide a robust synopsis for high level overviews.',
    meta: 'ROI: 30%',
  },
  {
    header: 'Project Report - May',
    description:
      'Bring to the table win-win survival strategies to ensure proactive domination.',
    meta: 'ROI: 34%',
  },
  {
    header: 'Project Report - June',
    description:
      'Capitalise on low hanging fruit to identify a ballpark value added activity to beta test.',
    meta: 'ROI: 27%',
  },
];

const CategoryFilter = () => <Card.Group items={items} />;

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(CategoryFilter);
