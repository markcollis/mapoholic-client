import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Collapse extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.objectOf(PropTypes.any),
    ]),
    children: PropTypes.node,
    refreshCollapse: PropTypes.number, // used to trigger re-render, value unimportant
    startHidden: PropTypes.bool,
  };

  static defaultProps = {
    title: '[no title provided]',
    children: [],
    refreshCollapse: 0,
    startHidden: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      hideContent: false,
      contentHeight: null,
      propsChanged: true,
      children: null,
      refreshCollapse: null,
    };
    this.contentRef = React.createRef();
  }

  componentDidMount() {
    const { children, refreshCollapse, startHidden } = this.props;
    this.setState({ children, refreshCollapse, hideContent: startHidden });
    window.addEventListener('resize', this.onResizeWindow);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { children, refreshCollapse } = prevState;
    const { children: newChildren, refreshCollapse: newRefreshCollapse } = nextProps;
    if (newRefreshCollapse !== refreshCollapse) {
      return { propsChanged: true, refreshCollapse: newRefreshCollapse };
    }
    if (newChildren !== children) { // does this compare deeply enough?
      return { propsChanged: true, children: newChildren };
    }
    return null;
  }

  /* eslint react/no-did-update-set-state: 0 */
  componentDidUpdate() {
    const { propsChanged } = this.state;
    if (propsChanged && this.contentRef.current) { // OK to set state due to this check
      this.setState({ propsChanged: false, contentHeight: this.contentRef.current.clientHeight });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeWindow);
  }

  onResizeWindow = () => {
    // console.log('onResizeWindow triggered => re-render');
    this.setState({ propsChanged: true });
  }

  swapVisibility = (e) => {
    e.preventDefault();
    const { hideContent, contentHeight } = this.state;
    const currentHeight = this.contentRef.current.clientHeight;
    this.setState({ hideContent: !hideContent });
    if (!hideContent) {
      if (currentHeight !== contentHeight) {
        this.setState({ contentHeight: currentHeight });
      }
    }
  }

  render() {
    const { title, children } = this.props;
    // console.log('props and state in Collapse', title, this.props, this.state);
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
          {(hideContent)
            ? <i className="icon angle down large floatedright" />
            : <i className="icon angle up large floatedright" />}
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
