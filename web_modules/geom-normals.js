/** @module vec3 */ /**
 * Returns a new vec3 at 0, 0, 0.
 * @returns {import("./types.js").vec3}
 */ function create() {
    return [
        0,
        0,
        0
    ];
}
/**
 * Sets a vector to another vector.
 * @param {import("./types.js").vec3} a
 * @param {import("./types.js").vec3} b
 * @returns {import("./types.js").vec3}
 */ function set$1(a, b) {
    a[0] = b[0];
    a[1] = b[1];
    a[2] = b[2];
    return a;
}
/**
 * Adds a vector to another.
 * @param {import("./types.js").vec3} a
 * @param {import("./types.js").vec3} b
 * @returns {import("./types.js").vec3}
 */ function add$1(a, b) {
    a[0] += b[0];
    a[1] += b[1];
    a[2] += b[2];
    return a;
}
/**
 * Subtracts a vector from another.
 * @param {import("./types.js").vec3} a
 * @param {import("./types.js").vec3} b
 * @returns {import("./types.js").vec3}
 */ function sub$1(a, b) {
    a[0] -= b[0];
    a[1] -= b[1];
    a[2] -= b[2];
    return a;
}
/**
 * Calculates the cross product of two vectors.
 * @param {import("./types.js").vec3} a
 * @param {import("./types.js").vec3} b
 * @returns {import("./types.js").vec3}
 */ function cross$1(a, b) {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    const vx = b[0];
    const vy = b[1];
    const vz = b[2];
    a[0] = y * vz - vy * z;
    a[1] = z * vx - vz * x;
    a[2] = x * vy - vx * y;
    return a;
}
/**
 * Normalises a vector.
 * @param {import("./types.js").vec3} a
 * @returns {import("./types.js").vec3}
 */ function normalize$1(a) {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    let l = Math.sqrt(x * x + y * y + z * z);
    l = 1 / (l || 1);
    a[0] *= l;
    a[1] *= l;
    a[2] *= l;
    return a;
}

/**
 * Sets a vector components.
 * @param {import("./types.js").avec3} a
 * @param {number} i
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */ function set3(a, i, x, y, z) {
    a[i * 3] = x;
    a[i * 3 + 1] = y;
    a[i * 3 + 2] = z;
}
/**
 * Sets a vector to another vector.
 * @param {import("./types.js").avec3} a
 * @param {number} i
 * @param {import("./types.js").avec3} b
 * @param {number} j
 */ function set(a, i, b, j) {
    a[i * 3] = b[j * 3];
    a[i * 3 + 1] = b[j * 3 + 1];
    a[i * 3 + 2] = b[j * 3 + 2];
}
/**
 * Adds a vector to another.
 * @param {import("./types.js").avec3} a
 * @param {number} i
 * @param {import("./types.js").avec3} b
 * @param {number} j
 */ function add(a, i, b, j) {
    a[i * 3] += b[j * 3];
    a[i * 3 + 1] += b[j * 3 + 1];
    a[i * 3 + 2] += b[j * 3 + 2];
}
/**
 * Subtracts a vector from another.
 * @param {import("./types.js").avec3} a
 * @param {number} i
 * @param {import("./types.js").avec3} b
 * @param {number} j
 */ function sub(a, i, b, j) {
    a[i * 3] -= b[j * 3];
    a[i * 3 + 1] -= b[j * 3 + 1];
    a[i * 3 + 2] -= b[j * 3 + 2];
}
/**
 * Calculates the cross product of two vectors.
 * @param {import("./types.js").avec3} a
 * @param {number} i
 * @param {import("./types.js").avec3} b
 * @param {number} j
 */ function cross(a, i, b, j) {
    const x = a[i * 3];
    const y = a[i * 3 + 1];
    const z = a[i * 3 + 2];
    const vx = b[j * 3];
    const vy = b[j * 3 + 1];
    const vz = b[j * 3 + 2];
    a[i * 3] = y * vz - vy * z;
    a[i * 3 + 1] = z * vx - vz * x;
    a[i * 3 + 2] = x * vy - vx * y;
}
/**
 * Normalises a vector.
 * @param {import("./types.js").avec3} a
 * @param {number} i
 */ function normalize(a, i) {
    const lenSq = a[i * 3] * a[i * 3] + a[i * 3 + 1] * a[i * 3 + 1] + a[i * 3 + 2] * a[i * 3 + 2];
    if (lenSq > 0) {
        const len = Math.sqrt(lenSq);
        a[i * 3] /= len;
        a[i * 3 + 1] /= len;
        a[i * 3 + 2] /= len;
    }
}

const TEMP_CELL = create();
const TEMP_VEC3_1 = create();
const TEMP_VEC3_2 = create();
function normals(positions, cells, normals) {
    const isFlatArray = !positions[0]?.length;
    const isCellsFlatArray = !cells[0]?.length;
    const cellCount = cells.length / (isCellsFlatArray ? 3 : 1);
    if (isFlatArray) {
        normals ||= new positions.constructor(positions.length).fill(0);
        for(let fi = 0; fi < cellCount; fi++){
            if (isCellsFlatArray) {
                set(TEMP_CELL, 0, cells, fi);
            } else {
                set$1(TEMP_CELL, cells[fi]);
            }
            set(TEMP_VEC3_1, 0, positions, TEMP_CELL[1]); // b
            sub(TEMP_VEC3_1, 0, positions, TEMP_CELL[0]); // ab = b - a
            normalize(TEMP_VEC3_1, 0);
            set(TEMP_VEC3_2, 0, positions, TEMP_CELL[2]); // c
            sub(TEMP_VEC3_2, 0, positions, TEMP_CELL[0]); // ac = c - a
            normalize(TEMP_VEC3_2, 0);
            cross(TEMP_VEC3_1, 0, TEMP_VEC3_2, 0); // ab x ac
            normalize(TEMP_VEC3_1, 0);
            for(let i = 0; i < 3; i++){
                add(normals, TEMP_CELL[i], TEMP_VEC3_1, 0);
            }
        }
        for(let i = 0; i < positions.length / 3; i++){
            if (!isNaN(normals[i * 3])) {
                normalize(normals, i);
            } else {
                set3(normals, i, 0, 1, 0);
            }
        }
        return normals;
    }
    normals ||= [];
    for(let fi = 0; fi < cellCount; fi++){
        if (isCellsFlatArray) {
            set(TEMP_CELL, 0, cells, fi);
        } else {
            set$1(TEMP_CELL, cells[fi]);
        }
        const a = positions[TEMP_CELL[0]];
        normalize$1(sub$1(set$1(TEMP_VEC3_1, positions[TEMP_CELL[1]]), a)); // ab = b - a
        normalize$1(sub$1(set$1(TEMP_VEC3_2, positions[TEMP_CELL[2]]), a)); // ac = c - a
        normalize$1(cross$1(TEMP_VEC3_1, TEMP_VEC3_2)); // ab x ac
        for(let i = 0; i < 3; i++){
            normals[TEMP_CELL[i]] ||= [
                0,
                0,
                0
            ];
            add$1(normals[TEMP_CELL[i]], TEMP_VEC3_1);
        }
    }
    for(let i = 0; i < normals.length; i++){
        if (normals[i]) {
            normalize$1(normals[i]);
        } else {
            normals[i] = [
                0,
                1,
                0
            ];
        }
    }
    return normals;
}

export { normals as default };
