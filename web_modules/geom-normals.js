function create() {
  return [0, 0, 0];
}

function equals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

function set(a, b) {
  a[0] = b[0];
  a[1] = b[1];
  a[2] = b[2];
  return a;
}

function add(a, b) {
  a[0] += b[0];
  a[1] += b[1];
  a[2] += b[2];
  return a;
}

function sub(a, b) {
  a[0] -= b[0];
  a[1] -= b[1];
  a[2] -= b[2];
  return a;
}

function scale(a, n) {
  a[0] *= n;
  a[1] *= n;
  a[2] *= n;
  return a;
}

function multMat4(a, m) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  a[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
  a[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
  a[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
  return a;
}

function multQuat(a, q) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var qx = q[0];
  var qy = q[1];
  var qz = q[2];
  var qw = q[3];
  var ix = qw * x + qy * z - qz * y;
  var iy = qw * y + qz * x - qx * z;
  var iz = qw * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z;
  a[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  a[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  a[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  return a;
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a, b) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var vx = b[0];
  var vy = b[1];
  var vz = b[2];
  a[0] = y * vz - vy * z;
  a[1] = z * vx - vz * x;
  a[2] = x * vy - vx * y;
  return a;
}

function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.sqrt(x * x + y * y + z * z);
}

function lengthSq(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}

function normalize(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var l = Math.sqrt(x * x + y * y + z * z);
  l = 1.0 / (l || 1);
  a[0] *= l;
  a[1] *= l;
  a[2] *= l;
  return a;
}

function distance(a, b) {
  var dx = b[0] - a[0];
  var dy = b[1] - a[1];
  var dz = b[2] - a[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function distanceSq(a, b) {
  var dx = b[0] - a[0];
  var dy = b[1] - a[1];
  var dz = b[2] - a[2];
  return dx * dx + dy * dy + dz * dz;
}

function limit(a, n) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var dsq = x * x + y * y + z * z;
  var lsq = n * n;

  if (lsq > 0 && dsq > lsq) {
    var nd = n / Math.sqrt(dsq);
    a[0] *= nd;
    a[1] *= nd;
    a[2] *= nd;
  }

  return a;
}

function lerp(a, b, n) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  a[0] = x + (b[0] - x) * n;
  a[1] = y + (b[1] - y) * n;
  a[2] = z + (b[2] - z) * n;
  return a;
}

function toString(a, precision) {
  var scale = Math.pow(10, precision !== undefined ? precision : 4);
  var s = '[';
  s += Math.floor(a[0] * scale) / scale + ', ';
  s += Math.floor(a[1] * scale) / scale + ', ';
  s += Math.floor(a[2] * scale) / scale + ']';
  return s;
}

function copy(a) {
  return a.slice(0);
}

function addScaled(v, w, n) {
  v[0] += w[0] * n;
  v[1] += w[1] * n;
  v[2] += w[2] * n;
  return v;
}

var Vec3 = {
  create: create,
  set: set,
  copy: copy,
  equals: equals,
  add: add,
  addScaled: addScaled,
  sub: sub,
  scale: scale,
  multMat4: multMat4,
  multQuat: multQuat,
  dot: dot,
  cross: cross,
  length: length,
  lengthSq: lengthSq,
  normalize: normalize,
  distance: distance,
  distanceSq: distanceSq,
  limit: limit,
  lerp: lerp,
  toString: toString
};
var vec3 = Vec3;

// https://github.com/hughsk/mesh-normals
// Compute normals for the mesh based on faces/cells information
// If there are two vertices with the same position but different index there will be discontinuity (hard edge)

function computeNormals(positions, cells, out) {
  var vertices = positions;
  var faces = cells;
  var normals = out || [];
  normals.length = 0;
  var count = [];
  var ab = [0, 0, 0];
  var ac = [0, 0, 0];
  var n = [0, 0, 0];

  for (let fi = 0, numFaces = faces.length; fi < numFaces; fi++) {
    var f = faces[fi];
    var a = vertices[f[0]];
    var b = vertices[f[1]];
    var c = vertices[f[2]];
    vec3.normalize(vec3.sub(vec3.set(ab, b), a));
    vec3.normalize(vec3.sub(vec3.set(ac, c), a));
    vec3.normalize(vec3.cross(vec3.set(n, ab), ac));

    for (let i = 0, len = f.length; i < len; i++) {
      if (!normals[f[i]]) {
        normals[f[i]] = [0, 0, 0];
      }

      vec3.add(normals[f[i]], n);
      count[f[i]] = count[f[i]] ? 1 : count[f[i]] + 1;
    }
  }

  for (let i = 0, len = normals.length; i < len; i++) {
    if (normals[i]) {
      vec3.normalize(normals[i]);
    } else {
      normals[i] = [0, 1, 0];
    }
  }

  return normals;
}

var geomNormals = computeNormals;

export default geomNormals;
