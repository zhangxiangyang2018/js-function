var Tween = {
  Linear: function (t, b, c, d) {
    return c * t / d + b;
  },
  easeIn: function (t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  easeOut: function (t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  }
}
module.exports.Tween = Tween;