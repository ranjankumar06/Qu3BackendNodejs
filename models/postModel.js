const mongoose = require("mongoose");
const moment = require('moment');
const { string } = require("joi");
const Schema = mongoose.Schema;

module.exports = function dynamicPostSchema(prefix) {
    const postSchema = new Schema({
        user_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        post_id: {
            type: String
        },
        name: {
            type: String,
        },
        ImageCode: {
            type: String,
        },
        Message: {
            type: String,
        },
        MusicID: {
            type: String,
        },
        BackgroundColor: {
            r: {
                type: String
            },
            g: {
                type: String
            },
            b: {
                type: String
            },
            a: {
                type: String
            }
        },
        Avatar: {
            URL: {
                type: String
            },
            transform: {
                position: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
                    },
                    z: {
                        type: String
                    },
                    normalized: {
                        x: {
                            type: String
                        },
                        y: {
                            type: String
                        },
                        z: {
                            type: String
                        },
                        magnitude: {
                            type: String
                        },
                        sqrMagnitude: {
                            type: String
                        },
                    },
                    magnitude: {
                        type: String
                    },
                    sqrMagnitude: {
                        type: String
                    },
                },
                Rotation: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
                    },
                    z: {
                        type: String
                    },
                    normalized: {
                        x: {
                            type: String
                        },
                        y: {
                            type: String
                        },
                        z: {
                            type: String
                        },
                        magnitude: {
                            type: String
                        },
                        sqrMagnitude: {
                            type: String
                        },
                    },
                    magnitude: {
                        type: String
                    },
                    sqrMagnitude: {
                        type: String
                    },
                },
                Scale: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
                    },
                    z: {
                        type: String
                    },
                    normalized: {
                        x: {
                            type: String
                        },
                        y: {
                            type: String
                        },
                        z: {
                            type: String
                        },
                        magnitude: {
                            type: String
                        },
                        sqrMagnitude: {
                            type: String
                        },
                    },
                    magnitude: {
                        type: String
                    },
                    sqrMagnitude: {
                        type: String
                    },
                }
            },
            AnimationID: {
                type: String
            }
        },
        BgColor: {
            r: {
                type: String
            },
            g: {
                type: String
            },
            b: {
                type: String
            },
            a: {
                type: String
            }
        },
        models: [{
            uid: {
                type: String
            },
            transform: {
                position: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
                    },
                    z: {
                        type: String
                    },
                    normalized: {
                        x: {
                            type: String
                        },
                        y: {
                            type: String
                        },
                        z: {
                            type: String
                        },
                        magnitude: {
                            type: String
                        },
                        sqrMagnitude: {
                            type: String
                        },
                    },
                    magnitude: {
                        type: String
                    },
                    sqrMagnitude: {
                        type: String
                    },
                },
                Rotation: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
                    },
                    z: {
                        type: String
                    },
                    normalized: {
                        x: {
                            type: String
                        },
                        y: {
                            type: String
                        },
                        z: {
                            type: String
                        },
                        magnitude: {
                            type: String
                        },
                        sqrMagnitude: {
                            type: String
                        },
                    },
                    magnitude: {
                        type: String
                    },
                    sqrMagnitude: {
                        type: String
                    },
                },
                Scale: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
                    },
                    z: {
                        type: String
                    },
                    normalized: {
                        x: {
                            type: String
                        },
                        y: {
                            type: String
                        },
                        z: {
                            type: String
                        },
                        magnitude: {
                            type: String
                        },
                        sqrMagnitude: {
                            type: String
                        },
                    },
                    magnitude: {
                        type: String
                    },
                    sqrMagnitude: {
                        type: String
                    },
                }
            },
            AnimationID: {
                type: String
            },

        }],
        text3d: [{
            text: {
                type: String
            },
            fontid: {
                type: String
            },
            transform: {
                position: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
                    },
                    z: {
                        type: String
                    },
                    normalized: {
                        x: {
                            type: String
                        },
                        y: {
                            type: String
                        },
                        z: {
                            type: String
                        },
                        magnitude: {
                            type: String
                        },
                        sqrMagnitude: {
                            type: String
                        },
                    },
                    magnitude: {
                        type: String
                    },
                    sqrMagnitude: {
                        type: String
                    },
                },
                Rotation: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
                    },
                    z: {
                        type: String
                    },
                    normalized: {
                        x: {
                            type: String
                        },
                        y: {
                            type: String
                        },
                        z: {
                            type: String
                        },
                        magnitude: {
                            type: String
                        },
                        sqrMagnitude: {
                            type: String
                        },
                    },
                    magnitude: {
                        type: String
                    },
                    sqrMagnitude: {
                        type: String
                    },
                },
                Scale: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
                    },
                    z: {
                        type: String
                    },
                    normalized: {
                        x: {
                            type: String
                        },
                        y: {
                            type: String
                        },
                        z: {
                            type: String
                        },
                        magnitude: {
                            type: String
                        },
                        sqrMagnitude: {
                            type: String
                        },
                    },
                    magnitude: {
                        type: String
                    },
                    sqrMagnitude: {
                        type: String
                    },
                }
            },
            AnimationID: {
                type: String
            },
        }],
        images: [{
            Imageid: {
                type: String
            },
            ModelUid: {
                type: String
            },
            ModelID: {
                type: String
            },
            transform: {
                position: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
                    },
                    z: {
                        type: String
                    },
                    normalized: {
                        x: {
                            type: String
                        },
                        y: {
                            type: String
                        },
                        z: {
                            type: String
                        },
                        magnitude: {
                            type: String
                        },
                        sqrMagnitude: {
                            type: String
                        },
                    },
                    magnitude: {
                        type: String
                    },
                    sqrMagnitude: {
                        type: String
                    },
                },
                Rotation: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
                    },
                    z: {
                        type: String
                    },
                    normalized: {
                        x: {
                            type: String
                        },
                        y: {
                            type: String
                        },
                        z: {
                            type: String
                        },
                        magnitude: {
                            type: String
                        },
                        sqrMagnitude: {
                            type: String
                        },
                    },
                    magnitude: {
                        type: String
                    },
                    sqrMagnitude: {
                        type: String
                    },
                },
                Scale: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
                    },
                    z: {
                        type: String
                    },
                    normalized: {
                        x: {
                            type: String
                        },
                        y: {
                            type: String
                        },
                        z: {
                            type: String
                        },
                        magnitude: {
                            type: String
                        },
                        sqrMagnitude: {
                            type: String
                        },
                    },
                    magnitude: {
                        type: String
                    },
                    sqrMagnitude: {
                        type: String
                    },
                }
            },
            AnimationID: {
                type: String
            },
        }],
        video: [{
            url: {
                type: String
            },
            modelUid: {
                type: String
            },
            modelid: {
                type: String
            },
            transform: {
                position: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
                    },
                    z: {
                        type: String
                    },
                    normalized: {
                        x: {
                            type: String
                        },
                        y: {
                            type: String
                        },
                        z: {
                            type: String
                        },
                        magnitude: {
                            type: String
                        },
                        sqrMagnitude: {
                            type: String
                        },
                    },
                    magnitude: {
                        type: String
                    },
                    sqrMagnitude: {
                        type: String
                    },
                },
                Rotation: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
                    },
                    z: {
                        type: String
                    },
                    normalized: {
                        x: {
                            type: String
                        },
                        y: {
                            type: String
                        },
                        z: {
                            type: String
                        },
                        magnitude: {
                            type: String
                        },
                        sqrMagnitude: {
                            type: String
                        },
                    },
                    magnitude: {
                        type: String
                    },
                    sqrMagnitude: {
                        type: String
                    },
                },
                Scale: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
                    },
                    z: {
                        type: String
                    },
                    normalized: {
                        x: {
                            type: String
                        },
                        y: {
                            type: String
                        },
                        z: {
                            type: String
                        },
                        magnitude: {
                            type: String
                        },
                        sqrMagnitude: {
                            type: String
                        },
                    },
                    magnitude: {
                        type: String
                    },
                    sqrMagnitude: {
                        type: String
                    },
                }
            },
            AnimationID: {
                type: String
            },
        }],
        gifs: [{
            GIF_Url: {
                type: String
            },
            ModelUid: {
                type: String
            },
            modelID: {
                type: String
            },
            transform: {
                position: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
                    },
                    z: {
                        type: String
                    },
                    normalized: {
                        x: {
                            type: String
                        },
                        y: {
                            type: String
                        },
                        z: {
                            type: String
                        },
                        magnitude: {
                            type: String
                        },
                        sqrMagnitude: {
                            type: String
                        },
                    },
                    magnitude: {
                        type: String
                    },
                    sqrMagnitude: {
                        type: String
                    },
                },
                Rotation: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
                    },
                    z: {
                        type: String
                    },
                    normalized: {
                        x: {
                            type: String
                        },
                        y: {
                            type: String
                        },
                        z: {
                            type: String
                        },
                        magnitude: {
                            type: String
                        },
                        sqrMagnitude: {
                            type: String
                        },
                    },
                    magnitude: {
                        type: String
                    },
                    sqrMagnitude: {
                        type: String
                    },
                },
                Scale: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
                    },
                    z: {
                        type: String
                    },
                    normalized: {
                        x: {
                            type: String
                        },
                        y: {
                            type: String
                        },
                        z: {
                            type: String
                        },
                        magnitude: {
                            type: String
                        },
                        sqrMagnitude: {
                            type: String
                        },
                    },
                    magnitude: {
                        type: String
                    },
                    sqrMagnitude: {
                        type: String
                    },
                }
            },
            AnimationID: {
                type: String
            },
        }],
        post_category: {
            type: String
        },
        post_tage: {
            type: String
        },
        post_description: {
            type: String
        },
        viewer: [{
            user_id: {
                type: Schema.Types.ObjectId,
                ref: "User",
            }
        }],
        music: {
            MusicUrl: {
                type: String
            },
            MusicName: {
                type: String
            },
            ArtistName: {
                type: String
            },
            AlbumArtURL: {
                type: String
            },
            startsFrom: {
                type: String
            },
        },
        comments_allow: {
            type: Boolean
        },
        views: {
            type: Number,
            default: 0
        },
        post_time: {
            type: String
        },
        post_status: {
            type: Boolean,
            default: true
        },
        is_deleted:{
            type: Boolean,
            default: false
        },
        likes: {
            type: Number,
            default: 0
        },
        comments: {
            type: Number,
            default: 0
        }

    }, { timestamps: true });
    return mongoose.model("post" + prefix, postSchema);
}

// const userToken = mongoose.model("userToken", userTokenSchema);
