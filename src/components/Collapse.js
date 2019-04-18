import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Collapse extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.objectOf(PropTypes.any),
    ]),
    children: PropTypes.node,
  };

  static defaultProps = {
    title: '[no title provided]',
    children: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      hideContent: false,
      contentHeight: null,
      propsChanged: true,
    };
    this.contentRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ propsChanged: false, contentHeight: this.contentRef.current.clientHeight });
    }, 200);
  }

  componentWillReceiveProps() {
    // console.log('will receive props');
    this.setState({ propsChanged: true });
  }

  componentDidUpdate() {
    const { propsChanged } = this.state;
    if (propsChanged) {
      this.setState({ propsChanged: false, contentHeight: this.contentRef.current.clientHeight });
    }
  }

  swapVisibility(e) {
    e.preventDefault();
    // const { title } = this.props;
    const { hideContent, contentHeight } = this.state;
    const currentHeight = this.contentRef.current.clientHeight;
    // if (title === 'User list') {
    //   console.log('heights (content, current):', contentHeight, currentHeight);
    // }
    this.setState({ hideContent: !hideContent });
    if (!hideContent) {
      if (currentHeight !== contentHeight) {
        this.setState({ contentHeight: currentHeight });
      }
    }
  }

  render() {
    const { title, children } = this.props;
    const { hideContent, contentHeight, propsChanged } = this.state;
    const currentHeight = `${(hideContent) ? 0 : contentHeight}px`;
    const contentStyle = (propsChanged) ? { visibility: 'hidden', maxHeight: '' } : { maxHeight: currentHeight };
    return (
      <div className="collapse">
        <div
          role="button"
          onClick={e => this.swapVisibility(e)}
          onKeyPress={e => this.swapVisibility(e)}
          tabIndex="0"
        >
          <span className="ui header">{title}</span>
          {(hideContent) ? <i className="icon dropdown" /> : null}
        </div>
        <div ref={this.contentRef} style={contentStyle} className={(hideContent) ? 'hide' : 'show'}>
          <div className="ui divider" />
          {children}
          <div />
        </div>
      </div>
    );
  }
}

export default Collapse;
