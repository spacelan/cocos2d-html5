// kmVec3TransformCoord

(function () {

  // Kernel configuration
  var kernelConfig = {
    kernelName:       "kmVec3TransformCoord",
    kernelInit:       init,
    kernelCleanup:    cleanup,
    kernelSimd:       simd,
    kernelNonSimd:    nonSimd,
    kernelIterations: 10000
  };

  // Hook up to the harness
  benchmarks.add(new Benchmark(kernelConfig));

  // Benchmark data, initialization and kernel functions
  var V = new cc.kmVec3();
  var T = new cc.kmMat4();
  var Out = new cc.kmVec3();
  var Vx4 = new cc.kmVec3SIMD();
  var Tx4 = new cc.kmMat4();
  var Outx4 = new cc.kmVec3SIMD();

  function init() {
    T.mat[0] = 1.0;
    T.mat[5] = 1.0;
    T.mat[10] = 1.0;
    T.mat[15] = 1.0;

    V.x = 0.0;
    V.y = 1.0;
    V.z = 0.0;

    Tx4.mat[0] = 1.0;
    Tx4.mat[5] = 1.0;
    Tx4.mat[10] = 1.0;
    Tx4.mat[15] = 1.0;

    Vx4.data[0] = 0.0;
    Vx4.data[1] = 1.0;
    Vx4.data[2] = 0.0;

    nonSimd(1);
    simd(1);
    return (V.x == Vx4.data[0]) && (V.y == Vx4.data[1]) && (V.z == Vx4.data[2]);
    
  }

  function cleanup() {
    return init(); // Sanity checking before and after are the same
  }

  function nonSimd(n) {
    for (var i = 0; i < n; i++) {
      cc.kmVec3TransformCoord(Out, V, T);
    }
  }

  function simd(n) {
    for (var i = 0; i < n; i++) {
      cc.kmVec3TransformCoordSIMD(Outx4, Vx4, Tx4);
    }
  }

} ());
