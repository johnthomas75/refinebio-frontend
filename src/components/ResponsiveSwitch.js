import React from 'react';

// This constant should be synced with the media queries that determine what width is
// for desktop
const DESKTOP_LIMIT = 1024;

/**
 * thanks to https://goshakkk.name/different-mobile-desktop-tablet-layouts-react/
 */
export default class ResponsiveSwitch extends React.Component {
  constructor() {
    super();

    this.state = {
      width: window.innerWidth
    };
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  // make sure to remove the listener
  // when the component is not mounted anymore
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  render() {
    const { mobile, desktop } = this.props;
    let isMobile = this.state.width < DESKTOP_LIMIT;

    if (isMobile) {
      return mobile();
    } else {
      return desktop();
    }
  }
}
