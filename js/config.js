export const W = 800;
export const H = 480;
export const GAME_STATE = {
    Menu: 0,
    Transition: 1,
    Playing: 2,
    GameOver: 3
};

const NOMINAL_UPDATE_INTERVAL = 16.666;

// Multiply by this to convert seconds into "nominals"
export const SECS_TO_NOMINALS = 1000 / NOMINAL_UPDATE_INTERVAL;
export const rect = {
    rectStep: 5,
    rects: null,
    rectColor: 0xffffff,
    rectWidth: 10,
    rectCount: 0,
    rectHeight: 5,
    rectDelay: 500
}
export const wall = {
    wallThickness: 5,
    wallTop: 30,
    wallLeft: 5,
    colors: [],
    wallBottom: H - 5,
    wallRight: W - 5,
}

export const levelSpecs = [
    [],
    [2, 0, 6],
    [3, 4, 8, 2],
    [5, 6, 10, 4]
];

export const scoreValues = {
    Electrode: 5,
    Spark: 25,
    Shell: 50,
    CruiseMissile: 75,
    Prog: 100,
    Grunt: 100,
    Enforcer: 200,
    Tank: 300,
    Brain: 500,
    Spheroid: 1000,
    Quark: 1000,
    Family: 1000,
    Powerup: 300
};

export const electrodes = {
    0: 'Triangle',
    1: 'Square',
    2: 'Rectangle',
    3: 'Dizzy',
    4: 'Diamond',
    5: 'Checkers',
    6: 'BlackDiamond'
};

export const RGB2Color = (r, g, b) => {
    return '0x' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
};

const byte2Hex = (n) => {
    return String("0123456789ABCDEF".substr((n >> 4) & 0x0F, 1)) + "0123456789ABCDEF".substr(n & 0x0F, 1);
};



