import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Collapse extends Component {
  static propTypes = {
    title: PropTypes.string,
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
      maxContentHeight: null,
    };
    this.contentRef = React.createRef();
  }

  componentDidMount() {
    // console.log('component mounted');
    // not very elegant but height is unreliable otherwise...
    setTimeout(() => this.setState({
      contentHeight: this.contentRef.current.clientHeight,
      maxContentHeight: this.contentRef.current.clientHeight,
    }), 100);
    // this.setState({ contentHeight: this.contentRef.current.clientHeight });
  }

  // componentDidUpdate(prevProps) {
  //   console.log('height on update:', this.contentRef.current.clientHeight);
  //   console.log('prevProps:', prevProps);
  //   // console.log('hidden height on update:', this.hiddenRef.current.clientHeight);
  // }

  swapVisibility(e) {
    const { contentHeight, maxContentHeight } = this.state;
    const currentHeight = this.contentRef.current.clientHeight;
    // console.log('heights (content max current):', contentHeight, maxContentHeight, currentHeight);
    e.preventDefault();
    const { hideContent } = this.state;
    this.setState({ hideContent: !hideContent });
    if (!hideContent) {
      if (currentHeight !== contentHeight) {
        if (currentHeight > maxContentHeight) {
          this.setState({ contentHeight: currentHeight, maxContentHeight: currentHeight });
        } else {
          this.setState({ contentHeight: maxContentHeight });
        }
      }
    }
    // if (!hideContent) {
    //   this.setState({ contentHeight: this.contentRef.current.clientHeight });
    // }
    // console.log('height:', this.contentRef.current.clientHeight);
  }

  render() {
    // if (this.contentRef.current) {
    //   this.setState({ contentHeight: this.contentRef.current.clientHeight });
    // }
    // this.setState({ contentHeight: this.contentRef.current.clientHeight });
    const { title, children } = this.props;
    const { hideContent, contentHeight } = this.state;
    const currentHeight = `${(hideContent) ? 0 : contentHeight}px`;
    // console.log('hideContent:', hideContent, title);
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
        <div ref={this.contentRef} style={{ maxHeight: currentHeight }} className={(hideContent) ? 'hide' : 'show'}>
          <div className="ui divider" />
          {children}
          <div />
        </div>
      </div>
    );
  }
}

export default Collapse;
