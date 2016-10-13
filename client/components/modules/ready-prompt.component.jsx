/**
 * quasar
 *
 * Copyright (c) 2015 Glipcode http://glipcode.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Colors from 'material-ui/styles/colors';
import GlobalStyles from '../../styles/global.styles';
import LoadingDialogComponent from './loading-dialog.component';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';

const styles = {
  css: {
    color: Colors.fullWhite,
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 3,
  },
};

let RoomActions = null;
let UserStore = null;

Dependency.autorun(()=> {
  RoomActions = Dependency.get('RoomActions');
  UserStore = Dependency.get('UserStore');
});

export class ReadyPromptComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    // join room stream directly if alone in room
    if (!this.props.room.connected.length) {
      RoomActions.joinRoomStream(this.props.room._id);
      this.setState({
        loading: true
      });
    };
  }

  joinRoomStream() {
    RoomActions.joinRoomStream(this.props.room._id);
  }

  render() {
    let loading = '';

    if (this.props.room.connected.length &&
      !~this.props.room.connected.indexOf(this.props.user._id)) {
      loading = (<div style={[GlobalStyles.table, styles.css]}>
        <LoadingDialogComponent
          open={(!!this.state.loading)}
          onTouchTap={this.props.onTouchTap}
          title='Joining'
          style={{zIndex: 3}}/>
        <div className='text-center' style={[GlobalStyles.cell]}>
          <p>Are you ready to join?</p>
          <RaisedButton label='Join'
            secondary={true}
            onTouchTap={this.joinRoomStream.bind(this)}>
          </RaisedButton>
        </div>
      </div>);
    }

    return (
      <div onTouchTap={this.props.onTouchTap}>
        {loading}
      </div>
    );
  }
}

ReadyPromptComponent.propTypes = {
  onTouchTap: React.PropTypes.func,
  room: React.PropTypes.object,
  user: React.PropTypes.object,
};

export default createContainer(({params}) => {
  return {
    user: UserStore.user(),
  };
}, Radium(ReadyPromptComponent));
