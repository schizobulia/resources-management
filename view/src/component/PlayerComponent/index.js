import React from 'react';
import * as Hls from 'hls.js';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import Tool from '../../until/tool';
const { Option } = Select;

/**
 * hls player
 * 
 * $ npm install hls.js
 */
class PlayerComponent extends React.Component {

    state = {
        sourceLink: this.props.sourceLink,
        hlsLinks: this.props.hlsLinks,
        hls: null
    }

    static propTypes = {
        sourceLink: PropTypes.string,
        hlsLinks: PropTypes.array
    }

    componentDidMount = () => {
        try {
            this.player(this.state.hlsLinks[0]);
        } catch (error) {
            
        }
    }

    /**
     * init player
     * @param {*} videoSrc 
     */
    player = (videoSrc, value) => {
        var video = document.getElementById('video');
        if (value === 'source') {
            Tool.loadSourceVideo(videoSrc, (blob) => {
                video.src = blob;
            })
            return;
        }

        if (Hls.isSupported()) {
            if (this.state.hls) {
                this.state.hls.destroy();
            }
            this.setState({
                hls: new Hls()
            }, () => {
                let hls = this.state.hls;
                hls.loadSource(videoSrc);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    video.play();
                });
            })
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
 
            video.src = videoSrc;
            video.addEventListener('loadedmetadata', function () {
                video.play();
            });
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.sourceLink !== this.state.sourceLink) {
            this.setState({
                sourceLink: nextProps.sourceLink,
                hlsLinks: nextProps.hlsLinks
            }, () => {
                this.player(0);
            });
            return true;
        }
        return false;
    }

    handleChange = (value) => {
        if (value === 'source') {
            this.player(this.state.sourceLink, value);
        } else {
            this.player(this.state.hlsLinks[parseInt(value)]);
        }
    }

    render() {
        return (
            <div>
                <video id="video" width="100%" height="265px" controls="controls"></video>
                <Select defaultValue="0" style={{ width: 120 }} onChange={this.handleChange}>
                    <Option value="0">1080P</Option>
                    <Option value="1">720P</Option>
                    <Option value="2">480P</Option>
                    <Option value="source">source</Option>
                </Select>
            </div>

        )
    }
}

export default PlayerComponent;