var elms = ['track', 'timer', 'duration', 'playBtn', 'pauseBtn', 'prevBtn', 'nextBtn', 'playlistBtn', 'volumeBtn', 'progress', 'bar', 'wave', 'loading', 'playlist', 'list', 'volume', 'barEmpty', 'barFull', 'sliderBtn'];
        elms.forEach(function (elm) {
            window[elm] = document.getElementById(elm);
            console.log('elements are ready');
        });

        /**
         * Player class containing the state of our playlist and where we are in it.
         * Includes all methods for playing, skipping, updating the display, etc.
         * @param {Array} playlist Array of objects with playlist song details ({title, file, howl}).
         */
        var Player = function (playlist) {
            this.playlist = playlist;
            this.index = 0;
            console.log('playlist ready');
            // Display the title of the first track.
            track.innerHTML = '1. ' + playlist[0].title;
            console.log('Display the title of the first track');
            // Setup the playlist display.
            playlist.forEach(function (song) {
                var div = document.createElement('div');
                div.className = 'list-song';
                div.innerHTML = song.title;
                div.onclick = function () {
                    player.skipTo(playlist.indexOf(song));
                };
                list.appendChild(div);
            });
        };
        Player.prototype = {
            /**
             * Play a song in the playlist.
             * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
             */
            play: function (index) {
                var self = this;
                var sound;

                index = typeof index === 'number' ? index : self.index;
                var data = self.playlist[index];

                // If we already loaded this track, use the current one.
                // Otherwise, setup and load a new Howl.
                if (data.howl) {
                    sound = data.howl;
                } else {
                    sound = data.howl = new Howl({
                        src: ['./audio/' + data.file + '.webm', './audio/' + data.file + '.mp3'],
                        html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
                        onplay: function () {
                            // Display the duration.
                            duration.innerHTML = self.formatTime(Math.round(sound.duration()));

                            // Start updating the progress of the track.
                           requestAnimationFrame(self.step.bind(self));

                            // Start the wave animation if we have already loaded
                          wave.container.style.display = 'block';
                            bar.style.display = 'none';
                            pauseBtn.style.display = 'block';
                            console.log('start wave animation on play');
                        },
                        onload: function () {
                            // Start the wave animation.
                           wave.container.style.display = 'block';
                            bar.style.display = 'none';
                            loading.style.display = 'none';
                            console.log('onload');
                        },
                        onend: function () {
                         //Stop the wave animation.
                          wave.container.style.display = 'none';
                            bar.style.display = 'block';
                            self.skip('next');
                            console.log('onend');
                        },
                        onpause: function () {
                            // Stop the wave animation.
                           wave.container.style.display = 'none';
                            bar.style.display = 'block';
                            console.log('onpause');
                        },
                        onstop: function () {
                            // Stop the wave animation.
                           wave.container.style.display = 'none';
                            bar.style.display = 'block';
                            console.log('onstop');
                        },
                        onseek: function () {
                            // Start updating the progress of the track.
                            requestAnimationFrame(self.step.bind(self));
                            console.log('onseek');
                        }
                    });
                }

                // Begin playing the sound.
                sound.play();
                console.log('plays sound');
                // Update the track display.
                track.innerHTML = (index + 1) + '. ' + data.title;

                // Show the pause button.
                if (sound.state() === 'loaded') {
                    playBtn.style.display = 'none';
                    pauseBtn.style.display = 'block';
                    console.log('shows pause button');
                } else {
                    loading.style.display = 'block';
                    playBtn.style.display = 'none';
                    pauseBtn.style.display = 'none';
                }

                // Keep track of the index we are currently playing.
                self.index = index;
            },

            /**
             * Pause the currently playing track.
             */
            pause: function () {
                var self = this;

                // Get the Howl we want to manipulate.
                var sound = self.playlist[self.index].howl;

                // Puase the sound.
                sound.pause();
                
                // Show the play button.
                playBtn.style.display = 'block';
                pauseBtn.style.display = 'none';
                console.log('pause is happening');
            },

            /**
             * Skip to the next or previous track.
             * @param  {String} direction 'next' or 'prev'.
            
            skip: function (direction) {
                var self = this;

                // Get the next track based on the direction of the track.
                var index = 0;
                if (direction === 'prev') {
                    index = self.index - 1;
                    if (index < 0) {
                        index = self.playlist.length - 1;
                    }
                } else {
                    index = self.index + 1;
                    if (index >= self.playlist.length) {
                        index = 0;
                    }
                }

                self.skipTo(index);
                console.log('skip function works');
            }, */

            /**
             * Skip to a specific track based on its playlist index.
             * @param  {Number} index Index in the playlist.
            
            skipTo: function (index) {
                var self = this;

                // Stop the current track.
                if (self.playlist[self.index].howl) {
                    self.playlist[self.index].howl.stop();
                }

                // Reset progress.
                progress.style.width = '0%';

                // Play the new track.
                self.play(index);
            }, */

            /**
             * Set the volume and update the volume slider display.
             * @param  {Number} val Volume between 0 and 1.
             */
            volume: function (val) {
                var self = this;

                // Update the global volume (affecting all Howls).
                Howler.volume(val);

                // Update the display on the slider.
                var barWidth = (val * 90) / 100;
                barFull.style.width = (barWidth * 100) + '%';
                sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
            },

            /**
             * Seek to a new position in the currently playing track.
             * @param  {Number} per Percentage through the song to skip.
             */
            seek: function (per) {
                var self = this;

                // Get the Howl we want to manipulate.
                var sound = self.playlist[self.index].howl;

                // Convert the percent into a seek position.
                if (sound.playing()) {
                    sound.seek(sound.duration() * per);
                }
            },

            /**
             * The step called within requestAnimationFrame to update the playback position.
             */
       /*     step: function () {
                var self = this;

                // Get the Howl we want to manipulate.
                var sound = self.playlist[self.index].howl;

                // Determine our current seek position.
                var seek = sound.seek() || 0;
                timer.innerHTML = self.formatTime(Math.round(seek));
                progress.style.width = (((seek / sound.duration()) * 100) || 0) + '%';

                // If the sound is still playing, continue stepping.
                if (sound.playing()) {
                    requestAnimationFrame(self.step.bind(self));
                }
            },*/

            /**
             * Toggle the playlist display on/off.
             */
            togglePlaylist: function () {
                var self = this;
                var display = (playlist.style.display === 'block') ? 'none' : 'block';

                setTimeout(function () {
                    playlist.style.display = display;
                }, (display === 'block') ? 0 : 500);
                playlist.className = (display === 'block') ? 'fadein' : 'fadeout';
            },

            /**
             * Toggle the volume display on/off.
             */
            toggleVolume: function () {
                var self = this;
                var display = (volume.style.display === 'block') ? 'none' : 'block';

                setTimeout(function () {
                    volume.style.display = display;
                }, (display === 'block') ? 0 : 500);
                volume.className = (display === 'block') ? 'fadein' : 'fadeout';
            },

            /**
             * Format the time from seconds to M:SS.
             * @param  {Number} secs Seconds to format.
             * @return {String}      Formatted time.
             */
            formatTime: function (secs) {
                var minutes = Math.floor(secs / 60) || 0;
                var seconds = (secs - minutes * 60) || 0;

                return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
            }
        };

        // Setup our new audio player class and pass it the playlist.
        var player = new Player([
            {
                title: 'Rave Digger',
                file: 'rave_digger',
                howl: null
            },
            {
                title: '80s Vibe',
                file: '80s_vibe',
                howl: null
            },
            {
                title: 'Running Out',
                file: 'running_out',
                howl: null
            }
        ]);

        // Bind our player controls.
        playBtn.addEventListener('click', function () {
            player.play();
        });
        pauseBtn.addEventListener('click', function () {
            player.pause();
        });
        /*prevBtn.addEventListener('click', function () {
            player.skip('prev');
        });
        nextBtn.addEventListener('click', function () {
            player.skip('next');
        });*/
        waveform.addEventListener('click', function (event) {
            player.seek(event.clientX / window.innerWidth);
        });
        playlistBtn.addEventListener('click', function () {
            player.togglePlaylist();
        });
        playlist.addEventListener('click', function () {
            player.togglePlaylist();
        });
        volumeBtn.addEventListener('click', function () {
            player.toggleVolume();
        });
        volume.addEventListener('click', function () {
            player.toggleVolume();
        });

        // Setup the event listeners to enable dragging of volume slider.
        barEmpty.addEventListener('click', function (event) {
            var per = event.layerX / parseFloat(barEmpty.scrollWidth);
            player.volume(per);
        });
        sliderBtn.addEventListener('mousedown', function () {
            window.sliderDown = true;
        });
        sliderBtn.addEventListener('touchstart', function () {
            window.sliderDown = true;
        });
        volume.addEventListener('mouseup', function () {
            window.sliderDown = false;
        });
        volume.addEventListener('touchend', function () {
            window.sliderDown = false;
        });

        var move = function (event) {
            if (window.sliderDown) {
                var x = event.clientX || event.touches[0].clientX;
                var startX = window.innerWidth * 0.05;
                var layerX = x - startX;
                var per = Math.min(1, Math.max(0, layerX / parseFloat(barEmpty.scrollWidth)));
                player.volume(per);
            }
        };

        volume.addEventListener('mousemove', move);
        volume.addEventListener('touchmove', move);

        // Setup the "waveform" animation.
        var wave = new SiriWave({
            container: waveform,
            width: window.innerWidth,
            height: window.innerHeight * 0.3,
            cover: true,
            speed: 0.03,
            amplitude: 0.7,
            frequency: 2
        });
        wave.start();

        // Update the height of the wave animation.
        // These are basically some hacks to get SiriWave.js to do what we want.
        var resize = function () {
            var height = window.innerHeight * 0.3;
            var width = window.innerWidth;
            wave.height = height;
            wave.height_2 = height / 2;
            wave.MAX = wave.height_2 - 4;
            wave.width = width;
            wave.width_2 = width / 2;
            wave.width_4 = width / 4;
            wave.canvas.height = height;
            wave.canvas.width = width;
            wave.container.style.margin = -(height / 2) + 'px auto';

            // Update the position of the slider.
            var sound = player.playlist[player.index].howl;
            if (sound) {
                var vol = sound.volume();
                var barWidth = (vol * 0.9);
                sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
            }
        };
        window.addEventListener('resize', resize);
        resize();
if ('geolocation' in navigator) {
    console.log('great');
    navigator.geolocation.watchPosition(position => {
        console.log(position);
        var lat = position.coords.latitude;
        document.getElementById('latitude').textContent = lat;
        var lon = position.coords.longitude;
        document.getElementById('longitude').textContent = lon;
        function distance(lat1, lon1, lat2, lon2, unit) { //unit is for kilometers miles etc function pou ypologizei apostash
            if ((lat1 == lat2) && (lon1 == lon2)) {
                return 0;
            }
            else {
                var radlat1 = Math.PI * lat1 / 180;
                var radlat2 = Math.PI * lat2 / 180;
                var theta = lon1 - lon2;
                var radtheta = Math.PI * theta / 180;
                var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                if (dist > 1) {
                    dist = 1;
                }
                dist = Math.acos(dist);
                dist = dist * 180 / Math.PI;
                dist = dist * 60 * 1.1515;
                if (unit == "K") { dist = dist * 1.609344 }// calculates in kilometers
                if (unit == "M") { dist = dist * 0.8684 }// calculates in miles will remove later
                console.log('calculate distance');
                return dist;
            }
        }
       

        var isPlaying = new Boolean(true);
        /*const playlist = [oneAM, twoAM, threeAM, fourAM];*/

        //const playlist = [oneAM, twoAM, threeAM, fourAM]
        function playSound(isPlaying, i) {
            //check if sound is null, if not stop previous sound and unload it
            if (isPlaying == true) {
                
                Howler.stop();
                console.log('music already playing');
                player.play(i);
            } else {
                console.log('music not playing yet');
                player.play(i);
            }
        }
        const x = [1, 37, 95, 90];
        const y = [1, 23, 150, 98];
        const rows = 3;
       /* var oneAM = new Howl({
            src: ['1AM Rain - AC.mp3']
        });
        var twoAM = new Howl({
            src: ['2AM Rain- AC.mp3']
        });
        var threeAM = new Howl({
            src: ['3AM Rain- AC.mp3']
        });
        var fourAM = new Howl({
            src: ['4AM Rain - AC.mp3']
        });
        var audiolist = [oneAM, twoAM, threeAM, fourAM];*/
        for (var i = 0; i < rows; i++) {
            d = distance(lat, lon, x[i], y[i], "K");
            d = d / 1000;
            console.log(d);
            
            if (d > 3) {
               console.log(x[i]);
               console.log(y[i]);
               /* var audioinput = audiolist[i];
                console.log(audioinput);
                source = audioinput.src;
                console.log(source);*/
                console.log('music');
                playSound(isPlaying, i);
                isPlaying = new Boolean(true);               
            } else {
                if (isPlaying = true) {
                    Howler.stop();
                    console.log('music stops');
                    isPlaying = new Boolean(false);
                }

                console.log('no music');

            }
        }
    });


    

} else {
    console.log('uuuuuugh, no geolocation here');
}

const errorCallback = (error) => {
    console.error(error);
};
//geolocation ends here
// Cache references to DOM elements.
