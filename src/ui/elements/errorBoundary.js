import React from 'react';
import { connect } from 'react-redux';
import { Snippet } from './Snippet';
import { Container } from 'reactstrap';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.handleDismissError = this.handleDismissError.bind(this);
    this.handleInvokeAssistance = this.handleInvokeAssistance.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
  }

  handleDismissError() {
    this.setState({ hasError: false, error: null, info: null });
//    if (this.props.dispatch) {
////      this.props.dispatch(navigateToAppsList());
//    }
  }

  handleInvokeAssistance() {
//    if (this.props.dispatch) {
////      this.props.dispatch(together(modalInvoked, gaModalInvoked)('assist'));
//    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const errorText = String(this.state.error);

    return <Container>
      <h3>Something went wrong</h3>
      <p>Please try to reload the page. If the problem persists please seek support <br />
        using the copy-pasted information below to describe what went wrong <br /> and by clicking the <button
          className="btn btn-xs btn-outline-secondary" onClick={ this.handleInvokeAssistance }>? Help</button> button
      </p>

      <h4>Error:</h4>
      <p>
        <Snippet messageToCopy={ errorText } lang={ 'text' } />
      </p>

      <p>
        <button className="btn btn-sm btn-primary" onClick={ this.handleDismissError }>Dismiss</button>
      </p>

    </Container>;
  }
}

export default connect()(ErrorBoundary);
