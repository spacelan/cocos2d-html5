/**
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2008, Luke Benstead.
 All rights reserved.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * <p>
 A 4x4 matrix                         </br>
 </br>
 mat =                                 </br>
 | 0   4   8  12 |                     </br>
 | 1   5   9  13 |                     </br>
 | 2   6  10  14 |                     </br>
 | 3   7  11  15 |
 </p>
 */
cc.kmMat4 = function () {
    this.mat = new Float32Array([0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0]);
};

/**
 * Fills a kmMat4 structure with the values from a 16 element array of floats
 * @Params pOut - A pointer to the destination matrix
 * @Params pMat - A 16 element array of floats
 * @Return Returns pOut so that the call can be nested
 */
cc.kmMat4Fill = function (pOut, pMat) {
    pOut.mat[0] = pOut.mat[1] = pOut.mat[2] =pOut.mat[3] =
        pOut.mat[4] =pOut.mat[5] =pOut.mat[6] =pOut.mat[7] =
            pOut.mat[8] =pOut.mat[9] =pOut.mat[10] =pOut.mat[11] =
                pOut.mat[12] =pOut.mat[13] =pOut.mat[14] =pOut.mat[15] =pMat;
};

/**
 * Sets pOut to an identity matrix returns pOut
 * @Params pOut - A pointer to the matrix to set to identity
 * @Return Returns pOut so that the call can be nested
 */
cc.kmMat4Identity = function (pOut) {
    pOut.mat[1] = pOut.mat[2] = pOut.mat[3]
        = pOut.mat[4] = pOut.mat[6] = pOut.mat[7]
        = pOut.mat[8] = pOut.mat[9] = pOut.mat[11]
        = pOut.mat[12] = pOut.mat[13] = pOut.mat[14] = 0;
    pOut.mat[0] = pOut.mat[5] = pOut.mat[10] = pOut.mat[15] = 1.0;
    return pOut;
};

cc.kmMat4._get = function (pIn, row, col) {
    return pIn.mat[row + 4 * col];
};

cc.kmMat4._set = function (pIn, row, col, value) {
    pIn.mat[row + 4 * col] = value;
};

cc.kmMat4._swap = function (pIn, r1, c1, r2, c2) {
    var tmp = cc.kmMat4._get(pIn, r1, c1);
    cc.kmMat4._set(pIn, r1, c1, cc.kmMat4._get(pIn, r2, c2));
    cc.kmMat4._set(pIn, r2, c2, tmp);
};

//Returns an upper and a lower triangular matrix which are L and R in the Gauss algorithm
cc.kmMat4._gaussj = function (a, b) {
    var i, icol = 0, irow = 0, j, k, l, ll, n = 4, m = 4;
    var big, dum, pivinv;
    var indxc = [0, 0, 0, 0];
    var indxr = [0, 0, 0, 0];
    var ipiv = [0, 0, 0, 0];

    /*    for (j = 0; j < n; j++) {
     ipiv[j] = 0;
     }*/

    for (i = 0; i < n; i++) {
        big = 0.0;
        for (j = 0; j < n; j++) {
            if (ipiv[j] != 1) {
                for (k = 0; k < n; k++) {
                    if (ipiv[k] == 0) {
                        if (Math.abs(cc.kmMat4._get(a, j, k)) >= big) {
                            big = Math.abs(cc.kmMat4._get(a, j, k));
                            irow = j;
                            icol = k;
                        }
                    }
                }
            }
        }
        ++(ipiv[icol]);
        if (irow != icol) {
            for (l = 0; l < n; l++)
                cc.kmMat4._swap(a, irow, l, icol, l);
            for (l = 0; l < m; l++)
                cc.kmMat4._swap(b, irow, l, icol, l);
        }
        indxr[i] = irow;
        indxc[i] = icol;
        if (cc.kmMat4._get(a, icol, icol) == 0.0)
            return cc.KM_FALSE;

        pivinv = 1.0 / cc.kmMat4._get(a, icol, icol);
        cc.kmMat4._set(a, icol, icol, 1.0);
        for (l = 0; l < n; l++)
            cc.kmMat4._set(a, icol, l, cc.kmMat4._get(a, icol, l) * pivinv);

        for (l = 0; l < m; l++)
            cc.kmMat4._set(b, icol, l, cc.kmMat4._get(b, icol, l) * pivinv);

        for (ll = 0; ll < n; ll++) {
            if (ll != icol) {
                dum = cc.kmMat4._get(a, ll, icol);
                cc.kmMat4._set(a, ll, icol, 0.0);
                for (l = 0; l < n; l++)
                    cc.kmMat4._set(a, ll, l, cc.kmMat4._get(a, ll, l) - cc.kmMat4._get(a, icol, l) * dum);

                for (l = 0; l < m; l++)
                    cc.kmMat4._set(b, ll, l, cc.kmMat4._get(a, ll, l) - cc.kmMat4._get(b, icol, l) * dum);
            }
        }
    }
//    This is the end of the main loop over columns of the reduction. It only remains to unscram-
//    ble the solution in view of the column interchanges. We do this by interchanging pairs of
//    columns in the reverse order that the permutation was built up.
    for (l = n - 1; l >= 0; l--) {
        if (indxr[l] != indxc[l]) {
            for (k = 0; k < n; k++)
                cc.kmMat4._swap(a, k, indxr[l], k, indxc[l]);
        }
    }
    return cc.KM_TRUE;
};

cc.kmMat4._identity =
    new Float32Array([1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0]);

/**
 * Calculates the inverse of pM and stores the result in
 * pOut.
 * @Return Returns NULL if there is no inverse, else pOut
 */
cc.kmMat4Inverse = function (pOut, pM) {
    var inv = new cc.kmMat4();
    var tmp = new cc.kmMat4();

    cc.kmMat4Assign(inv, pM);
    cc.kmMat4Identity(tmp);

    if (cc.kmMat4._gaussj(inv, tmp) == cc.KM_FALSE)
        return null;

    cc.kmMat4Assign(pOut, inv);
    return pOut;
};

// Streaming SIMD Extensions -Inverse of 4x4 Matrix
// http://download.intel.com/design/PentiumIII/sml/24504301.pdf
var tsrc = new Float32Array(16);
var tmp   = new Float32Array(12);
cc.kmMat4InverseCramer = function(pOut, pM) {
    src = pM.mat;
    dst = pOut.mat;
    // Transpose the source matrix
    for (var i = 0; i < 4; i++) {
        tsrc[i] = src[i * 4];
        tsrc[i + 4] = src[i * 4 + 1];
        tsrc[i + 8] = src[i * 4 + 2];
        tsrc[i + 12] = src[i * 4 + 3];
    }

    // Calculate pairs for first 8 elements (cofactors)
    tmp[0] = tsrc[10] * tsrc[15];
    tmp[1] = tsrc[11] * tsrc[14];
    tmp[2] = tsrc[9] * tsrc[15];
    tmp[3] = tsrc[11] * tsrc[13];
    tmp[4] = tsrc[9] * tsrc[14];
    tmp[5] = tsrc[10] * tsrc[13];
    tmp[6] = tsrc[8] * tsrc[15];
    tmp[7] = tsrc[11] * tsrc[12];
    tmp[8] = tsrc[8] * tsrc[14];
    tmp[9] = tsrc[10] * tsrc[12];
    tmp[10] = tsrc[8] * tsrc[13];
    tmp[11] = tsrc[9] * tsrc[12];

    // calculate first 8 elements (cofactors)
    dst[0] = tmp[0] * tsrc[5] + tmp[3] * tsrc[6] + tmp[4] * tsrc[7];
    dst[0] -= tmp[1] * tsrc[5] + tmp[2] * tsrc[6] + tmp[5] * tsrc[7];
    dst[1] = tmp[1] * tsrc[4] + tmp[6] * tsrc[6] + tmp[9] * tsrc[7];
    dst[1] -= tmp[0] * tsrc[4] + tmp[7] * tsrc[6] + tmp[8] * tsrc[7];
    dst[2] = tmp[2] * tsrc[4] + tmp[7] * tsrc[5] + tmp[10] * tsrc[7];
    dst[2] -= tmp[3] * tsrc[4] + tmp[6] * tsrc[5] + tmp[11] * tsrc[7];
    dst[3] = tmp[5] * tsrc[4] + tmp[8] * tsrc[5] + tmp[11] * tsrc[6];
    dst[3] -= tmp[4] * tsrc[4] + tmp[9] * tsrc[5] + tmp[10] * tsrc[6];
    dst[4] = tmp[1] * tsrc[1] + tmp[2] * tsrc[2] + tmp[5] * tsrc[3];
    dst[4] -= tmp[0] * tsrc[1] + tmp[3] * tsrc[2] + tmp[4] * tsrc[3];
    dst[5] = tmp[0] * tsrc[0] + tmp[7] * tsrc[2] + tmp[8] * tsrc[3];
    dst[5] -= tmp[1] * tsrc[0] + tmp[6] * tsrc[2] + tmp[9] * tsrc[3];
    dst[6] = tmp[3] * tsrc[0] + tmp[6] * tsrc[1] + tmp[11] * tsrc[3];
    dst[6] -= tmp[2] * tsrc[0] + tmp[7] * tsrc[1] + tmp[10] * tsrc[3];
    dst[7] = tmp[4] * tsrc[0] + tmp[9] * tsrc[1] + tmp[10] * tsrc[2];
    dst[7] -= tmp[5] * tsrc[0] + tmp[8] * tsrc[1] + tmp[11] * tsrc[2];

    // calculate pairs for second 8 elements (cofactors)
    tmp[0] = tsrc[2] * tsrc[7];
    tmp[1] = tsrc[3] * tsrc[6];
    tmp[2] = tsrc[1] * tsrc[7];
    tmp[3] = tsrc[3] * tsrc[5];
    tmp[4] = tsrc[1] * tsrc[6];
    tmp[5] = tsrc[2] * tsrc[5];
    tmp[6] = tsrc[0] * tsrc[7];
    tmp[7] = tsrc[3] * tsrc[4];
    tmp[8] = tsrc[0] * tsrc[6];
    tmp[9] = tsrc[2] * tsrc[4];
    tmp[10] = tsrc[0] * tsrc[5];
    tmp[11] = tsrc[1] * tsrc[4];

    // calculate second 8 elements (cofactors)
    dst[8] = tmp[0] * tsrc[13] + tmp[3] * tsrc[14] + tmp[4] * tsrc[15];
    dst[8] -= tmp[1] * tsrc[13] + tmp[2] * tsrc[14] + tmp[5] * tsrc[15];
    dst[9] = tmp[1] * tsrc[12] + tmp[6] * tsrc[14] + tmp[9] * tsrc[15];
    dst[9] -= tmp[0] * tsrc[12] + tmp[7] * tsrc[14] + tmp[8] * tsrc[15];
    dst[10] = tmp[2] * tsrc[12] + tmp[7] * tsrc[13] + tmp[10] * tsrc[15];
    dst[10] -= tmp[3] * tsrc[12] + tmp[6] * tsrc[13] + tmp[11] * tsrc[15];
    dst[11] = tmp[5] * tsrc[12] + tmp[8] * tsrc[13] + tmp[11] * tsrc[14];
    dst[11] -= tmp[4] * tsrc[12] + tmp[9] * tsrc[13] + tmp[10] * tsrc[14];
    dst[12] = tmp[2] * tsrc[10] + tmp[5] * tsrc[11] + tmp[1] * tsrc[9];
    dst[12] -= tmp[4] * tsrc[11] + tmp[0] * tsrc[9] + tmp[3] * tsrc[10];
    dst[13] = tmp[8] * tsrc[11] + tmp[0] * tsrc[8] + tmp[7] * tsrc[10];
    dst[13] -= tmp[6] * tsrc[10] + tmp[9] * tsrc[11] + tmp[1] * tsrc[8];
    dst[14] = tmp[6] * tsrc[9] + tmp[11] * tsrc[11] + tmp[3] * tsrc[8];
    dst[14] -= tmp[10] * tsrc[11] + tmp[2] * tsrc[8] + tmp[7] * tsrc[9];
    dst[15] = tmp[10] * tsrc[10] + tmp[4] * tsrc[8] + tmp[9] * tsrc[9];
    dst[15] -= tmp[8] * tsrc[9] + tmp[11] * tsrc[10] + tmp[5] * tsrc[8];

    // calculate determinant
    var det = tsrc[0] * dst[0] + tsrc[1] * dst[1] + tsrc[2] * dst[2] + tsrc[3] * dst[3];

    // calculate matrix inverse
    det = 1 / det;
    for (var j = 0; j < 16; j++) {
        dst[j] *= det;
    }
}

cc.kmMat4InverseSIMD = function (pOut, pM) {
    var src = pM.mat;
    var dest = pOut.mat;
    var src0, src1, src2, src3;
    var row0, row1, row2, row3;
    var tmp1;
    var minor0, minor1, minor2, minor3;
    var det;

    // Load the 4 rows
    var src0 = SIMD.float32x4.load(src, 0);
    var src1 = SIMD.float32x4.load(src, 4);
    var src2 = SIMD.float32x4.load(src, 8);
    var src3 = SIMD.float32x4.load(src, 12);

    // Transpose the source matrix.  Sort of.  Not a true transpose operation

    tmp1 = SIMD.float32x4.shuffle(src0, src1, 0, 1, 4, 5);
    row1 = SIMD.float32x4.shuffle(src2, src3, 0, 1, 4, 5);
    row0 = SIMD.float32x4.shuffle(tmp1, row1, 0, 2, 4, 6);
    row1 = SIMD.float32x4.shuffle(row1, tmp1, 1, 3, 5, 7);

    tmp1 = SIMD.float32x4.shuffle(src0, src1, 2, 3, 6, 7);
    row3 = SIMD.float32x4.shuffle(src2, src3, 2, 3, 6, 7);
    row2 = SIMD.float32x4.shuffle(tmp1, row3, 0, 2, 4, 6);
    row3 = SIMD.float32x4.shuffle(row3, tmp1, 1, 3, 5, 7);

    // This is a true transposition, but it will lead to an incorrect result

    //tmp1 = SIMD.float32x4.shuffle(src0, src1, 0, 1, 4, 5);
    //tmp2 = SIMD.float32x4.shuffle(src2, src3, 0, 1, 4, 5);
    //row0  = SIMD.float32x4.shuffle(tmp1, tmp2, 0, 2, 4, 6);
    //row1  = SIMD.float32x4.shuffle(tmp1, tmp2, 1, 3, 5, 7);

    //tmp1 = SIMD.float32x4.shuffle(src0, src1, 2, 3, 6, 7);
    //tmp2 = SIMD.float32x4.shuffle(src2, src3, 2, 3, 6, 7);
    //row2  = SIMD.float32x4.shuffle(tmp1, tmp2, 0, 2, 4, 6);
    //row3  = SIMD.float32x4.shuffle(tmp1, tmp2, 1, 3, 5, 7);

    // ----
    tmp1   = SIMD.float32x4.mul(row2, row3);
    tmp1   = SIMD.float32x4.swizzle(tmp1, 1, 0, 3, 2); // 0xB1 = 10110001
    minor0 = SIMD.float32x4.mul(row1, tmp1);
    minor1 = SIMD.float32x4.mul(row0, tmp1);
    tmp1   = SIMD.float32x4.swizzle(tmp1, 2, 3, 0, 1); // 0x4E = 01001110
    minor0 = SIMD.float32x4.sub(SIMD.float32x4.mul(row1, tmp1), minor0);
    minor1 = SIMD.float32x4.sub(SIMD.float32x4.mul(row0, tmp1), minor1);
    minor1 = SIMD.float32x4.swizzle(minor1, 2, 3, 0, 1); // 0x4E = 01001110

    // ----
    tmp1   = SIMD.float32x4.mul(row1, row2);
    tmp1   = SIMD.float32x4.swizzle(tmp1, 1, 0, 3, 2); // 0xB1 = 10110001
    minor0 = SIMD.float32x4.add(SIMD.float32x4.mul(row3, tmp1), minor0);
    minor3 = SIMD.float32x4.mul(row0, tmp1);
    tmp1   = SIMD.float32x4.swizzle(tmp1, 2, 3, 0, 1); // 0x4E = 01001110
    minor0 = SIMD.float32x4.sub(minor0, SIMD.float32x4.mul(row3, tmp1));
    minor3 = SIMD.float32x4.sub(SIMD.float32x4.mul(row0, tmp1), minor3);
    minor3 = SIMD.float32x4.swizzle(minor3, 2, 3, 0, 1); // 0x4E = 01001110

    // ----
    tmp1   = SIMD.float32x4.mul(SIMD.float32x4.swizzle(row1, 2, 3, 0, 1), row3); // 0x4E = 01001110
    tmp1   = SIMD.float32x4.swizzle(tmp1, 1, 0, 3, 2); // 0xB1 = 10110001
    row2   = SIMD.float32x4.swizzle(row2, 2, 3, 0, 1);  // 0x4E = 01001110
    minor0 = SIMD.float32x4.add(SIMD.float32x4.mul(row2, tmp1), minor0);
    minor2 = SIMD.float32x4.mul(row0, tmp1);
    tmp1   = SIMD.float32x4.swizzle(tmp1, 2, 3, 0, 1); // 0x4E = 01001110
    minor0 = SIMD.float32x4.sub(minor0, SIMD.float32x4.mul(row2, tmp1));
    minor2 = SIMD.float32x4.sub(SIMD.float32x4.mul(row0, tmp1), minor2);
    minor2 = SIMD.float32x4.swizzle(minor2, 2, 3, 0, 1); // 0x4E = 01001110

    // ----
    tmp1   = SIMD.float32x4.mul(row0, row1);
    tmp1   = SIMD.float32x4.swizzle(tmp1, 1, 0, 3, 2); // 0xB1 = 10110001
    minor2 = SIMD.float32x4.add(SIMD.float32x4.mul(row3, tmp1), minor2);
    minor3 = SIMD.float32x4.sub(SIMD.float32x4.mul(row2, tmp1), minor3);
    tmp1   = SIMD.float32x4.swizzle(tmp1, 2, 3, 0, 1); // 0x4E = 01001110
    minor2 = SIMD.float32x4.sub(SIMD.float32x4.mul(row3, tmp1), minor2);
    minor3 = SIMD.float32x4.sub(minor3, SIMD.float32x4.mul(row2, tmp1));

    // ----
    tmp1   = SIMD.float32x4.mul(row0, row3);
    tmp1   = SIMD.float32x4.swizzle(tmp1, 1, 0, 3, 2); // 0xB1 = 10110001
    minor1 = SIMD.float32x4.sub(minor1, SIMD.float32x4.mul(row2, tmp1));
    minor2 = SIMD.float32x4.add(SIMD.float32x4.mul(row1, tmp1), minor2);
    tmp1   = SIMD.float32x4.swizzle(tmp1, 2, 3, 0, 1); // 0x4E = 01001110
    minor1 = SIMD.float32x4.add(SIMD.float32x4.mul(row2, tmp1), minor1);
    minor2 = SIMD.float32x4.sub(minor2, SIMD.float32x4.mul(row1, tmp1));

    // ----
    tmp1   = SIMD.float32x4.mul(row0, row2);
    tmp1   = SIMD.float32x4.swizzle(tmp1, 1, 0, 3, 2); // 0xB1 = 10110001
    minor1 = SIMD.float32x4.add(SIMD.float32x4.mul(row3, tmp1), minor1);
    minor3 = SIMD.float32x4.sub(minor3, SIMD.float32x4.mul(row1, tmp1));
    tmp1   = SIMD.float32x4.swizzle(tmp1, 2, 3, 0, 1); // 0x4E = 01001110
    minor1 = SIMD.float32x4.sub(minor1, SIMD.float32x4.mul(row3, tmp1));
    minor3 = SIMD.float32x4.add(SIMD.float32x4.mul(row1, tmp1), minor3);

    // Compute determinant
    det   = SIMD.float32x4.mul(row0, minor0);
    det   = SIMD.float32x4.add(SIMD.float32x4.swizzle(det, 2, 3, 0, 1), det); // 0x4E = 01001110
    det   = SIMD.float32x4.add(SIMD.float32x4.swizzle(det, 1, 0, 3, 2), det); // 0xB1 = 10110001
    tmp1  = SIMD.float32x4.reciprocal(det);
    det   = SIMD.float32x4.sub(SIMD.float32x4.add(tmp1, tmp1), SIMD.float32x4.mul(det, SIMD.float32x4.mul(tmp1, tmp1)));
    det   = SIMD.float32x4.swizzle(det, 0, 0, 0, 0);

    // These shuffles aren't necessary if the faulty transposition is done
    // up at the top of this function.
    //minor0 = SIMD.float32x4.swizzle(minor0, 2, 1, 0, 3);
    //minor1 = SIMD.float32x4.swizzle(minor1, 2, 1, 0, 3);
    //minor2 = SIMD.float32x4.swizzle(minor2, 2, 1, 0, 3);
    //minor3 = SIMD.float32x4.swizzle(minor3, 2, 1, 0, 3);

    // Compute final values by multiplying with 1/det
    minor0 = SIMD.float32x4.mul(det, minor0);
    minor1 = SIMD.float32x4.mul(det, minor1);
    minor2 = SIMD.float32x4.mul(det, minor2);
    minor3 = SIMD.float32x4.mul(det, minor3);

    SIMD.float32x4.store(dest, 0, minor0);
    SIMD.float32x4.store(dest, 4, minor1);
    SIMD.float32x4.store(dest, 8, minor2);
    SIMD.float32x4.store(dest, 12, minor3);

    return pOut;
};

/**
 * Returns KM_TRUE if pIn is an identity matrix
 * KM_FALSE otherwise
 */
cc.kmMat4IsIdentity = function (pIn) {
    for (var i = 0; i < 16; i++) {
        if (cc.kmMat4._identity[i] != pIn.mat[i])
            return false;
    }
    return true;
};

cc.kmMat4IsIdentitySIMD = function (pIn) {
    var inx4 = SIMD.float32x4.load(pIn.mat, 0);
    var identityx4 = SIMD.float32x4.load(cc.kmMat4._identity, 0);
    var ret = SIMD.float32x4.equal(inx4, identityx4);
    if(ret.signMask === 0x00)
        return false;
        
    inx4 = SIMD.float32x4.load(pIn.mat, 4);
    identityx4 = SIMD.float32x4.load(cc.kmMat4._identity, 4);
    ret = SIMD.float32x4.equal(inx4, identityx4);
    if(ret.signMask === 0x00)
        return false;
    
    inx4 = SIMD.float32x4.load(pIn.mat, 8);
    identityx4 = SIMD.float32x4.load(cc.kmMat4._identity, 8);
    ret = SIMD.float32x4.equal(inx4, identityx4);
    if(ret.signMask === 0x00)
        return false;
    
    inx4 = SIMD.float32x4.load(pIn.mat, 12);
    identityx4 = SIMD.float32x4.load(cc.kmMat4._identity, 12);
    ret = SIMD.float32x4.equal(inx4, identityx4);
    if(ret.signMask === 0x00)
        return false;
    return true;
};

/**
 * Sets pOut to the transpose of pIn, returns pOut
 */
cc.kmMat4Transpose = function (pOut, pIn) {
    var x, z, outArr = pOut.mat,inArr = pIn.mat;
    for (z = 0; z < 4; ++z) {
        for (x = 0; x < 4; ++x)
            outArr[(z * 4) + x] = inArr[(x * 4) + z];
    }
    return pOut;
};

cc.kmMat4TransposeSIMD = function (pOut, pIn) {
    var outArr = pOut.mat, inArr = pIn.mat;
    var src0     = SIMD.float32x4.load(inArr, 0);
    var src1     = SIMD.float32x4.load(inArr, 4);
    var src2     = SIMD.float32x4.load(inArr, 8);
    var src3     = SIMD.float32x4.load(inArr, 12);
    var dst0;
    var dst1;
    var dst2;
    var dst3;
    var tmp01;
    var tmp23;

    tmp01 = SIMD.float32x4.shuffle(src0, src1, 0, 1, 4, 5);
    tmp23 = SIMD.float32x4.shuffle(src2, src3, 0, 1, 4, 5);
    dst0  = SIMD.float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
    dst1  = SIMD.float32x4.shuffle(tmp01, tmp23, 1, 3, 5, 7);

    tmp01 = SIMD.float32x4.shuffle(src0, src1, 2, 3, 6, 7);
    tmp23 = SIMD.float32x4.shuffle(src2, src3, 2, 3, 6, 7);
    dst2  = SIMD.float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
    dst3  = SIMD.float32x4.shuffle(tmp01, tmp23, 1, 3, 5, 7);

    SIMD.float32x4.store(outArr, 0, dst0);
    SIMD.float32x4.store(outArr, 4, dst1);
    SIMD.float32x4.store(outArr, 8, dst2);
    SIMD.float32x4.store(outArr, 12, dst3);
    return pOut;
}

/**
 * Multiplies pM1 with pM2, stores the result in pOut, returns pOut
 */
cc.kmMat4Multiply = function (pOut, pM1, pM2) {
    // Cache the matrix values (makes for huge speed increases!)
    var  outArray = pOut.mat;
    var a00 = pM1.mat[0], a01 = pM1.mat[1], a02 = pM1.mat[2], a03 = pM1.mat[3];
    var a10 = pM1.mat[4], a11 = pM1.mat[5], a12 = pM1.mat[6], a13 = pM1.mat[7];
    var a20 = pM1.mat[8], a21 = pM1.mat[9], a22 = pM1.mat[10], a23 = pM1.mat[11];
    var a30 = pM1.mat[12], a31 = pM1.mat[13], a32 = pM1.mat[14], a33 = pM1.mat[15];

    var b00 = pM2.mat[0], b01 = pM2.mat[1], b02 = pM2.mat[2], b03 = pM2.mat[3];
    var b10 = pM2.mat[4], b11 = pM2.mat[5], b12 = pM2.mat[6], b13 = pM2.mat[7];
    var b20 = pM2.mat[8], b21 = pM2.mat[9], b22 = pM2.mat[10], b23 = pM2.mat[11];
    var b30 = pM2.mat[12], b31 = pM2.mat[13], b32 = pM2.mat[14], b33 = pM2.mat[15];

    outArray[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    outArray[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    outArray[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    outArray[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
    outArray[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    outArray[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    outArray[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    outArray[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
    outArray[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    outArray[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    outArray[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    outArray[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
    outArray[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    outArray[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    outArray[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    outArray[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
    return pOut;
};

cc.kmMat4MultiplySIMD = function (pOut, pM1, pM2) {
    var a = pM1.mat;
    var b = pM2.mat;
    var out = pOut.mat;
        
    var a0 = SIMD.float32x4.load(a,0);
    var a1 = SIMD.float32x4.load(a,4);
    var a2 = SIMD.float32x4.load(a,8);
    var a3 = SIMD.float32x4.load(a,12);
    var b0 = SIMD.float32x4.load(b, 0);
    SIMD.float32x4.store(out, 0, SIMD.float32x4.add(
        SIMD.float32x4.mul(
            SIMD.float32x4.swizzle(b0, 0, 0, 0, 0), a0),
            SIMD.float32x4.add(
                 SIMD.float32x4.mul(SIMD.float32x4.swizzle(b0, 1, 1, 1, 1), a1),
                 SIMD.float32x4.add(
                      SIMD.float32x4.mul(SIMD.float32x4.swizzle(b0, 2, 2, 2, 2), a2),
                      SIMD.float32x4.mul(SIMD.float32x4.swizzle(b0, 3, 3, 3, 3), a3)))));
    var b1 = SIMD.float32x4.load(b, 4);
    SIMD.float32x4.store(out, 4, SIMD.float32x4.add(
        SIMD.float32x4.mul(
            SIMD.float32x4.swizzle(b1, 0, 0, 0, 0), a0),
            SIMD.float32x4.add(
                SIMD.float32x4.mul(SIMD.float32x4.swizzle(b1, 1, 1, 1, 1), a1),
                SIMD.float32x4.add(
                     SIMD.float32x4.mul(SIMD.float32x4.swizzle(b1, 2, 2, 2, 2), a2),
                     SIMD.float32x4.mul(SIMD.float32x4.swizzle(b1, 3, 3, 3, 3), a3)))));
    var b2 = SIMD.float32x4.load(b, 8);
    SIMD.float32x4.store(out, 8, SIMD.float32x4.add(
        SIMD.float32x4.mul(
            SIMD.float32x4.swizzle(b2, 0, 0, 0, 0), a0),
            SIMD.float32x4.add(
                SIMD.float32x4.mul(SIMD.float32x4.swizzle(b2, 1, 1, 1, 1), a1),
                SIMD.float32x4.add(
                     SIMD.float32x4.mul(SIMD.float32x4.swizzle(b2, 2, 2, 2, 2), a2),
                     SIMD.float32x4.mul(SIMD.float32x4.swizzle(b2, 3, 3, 3, 3), a3)))));
    var b3 = SIMD.float32x4.load(b, 12);
    SIMD.float32x4.store(out, 12, SIMD.float32x4.add(
        SIMD.float32x4.mul(
            SIMD.float32x4.swizzle(b3, 0, 0, 0, 0), a0),
            SIMD.float32x4.add(
                SIMD.float32x4.mul(SIMD.float32x4.swizzle(b3, 1, 1, 1, 1), a1),
                SIMD.float32x4.add(
                    SIMD.float32x4.mul(SIMD.float32x4.swizzle(b3, 2, 2, 2, 2), a2),
                    SIMD.float32x4.mul(SIMD.float32x4.swizzle(b3, 3, 3, 3, 3), a3)))));

    return pOut;
};

cc.getMat4MultiplyValue = function (pM1, pM2) {
    var m1 = pM1.mat, m2 = pM2.mat;
    var mat = new Float32Array(16);

    mat[0] = m1[0] * m2[0] + m1[4] * m2[1] + m1[8] * m2[2] + m1[12] * m2[3];
    mat[1] = m1[1] * m2[0] + m1[5] * m2[1] + m1[9] * m2[2] + m1[13] * m2[3];
    mat[2] = m1[2] * m2[0] + m1[6] * m2[1] + m1[10] * m2[2] + m1[14] * m2[3];
    mat[3] = m1[3] * m2[0] + m1[7] * m2[1] + m1[11] * m2[2] + m1[15] * m2[3];

    mat[4] = m1[0] * m2[4] + m1[4] * m2[5] + m1[8] * m2[6] + m1[12] * m2[7];
    mat[5] = m1[1] * m2[4] + m1[5] * m2[5] + m1[9] * m2[6] + m1[13] * m2[7];
    mat[6] = m1[2] * m2[4] + m1[6] * m2[5] + m1[10] * m2[6] + m1[14] * m2[7];
    mat[7] = m1[3] * m2[4] + m1[7] * m2[5] + m1[11] * m2[6] + m1[15] * m2[7];

    mat[8] = m1[0] * m2[8] + m1[4] * m2[9] + m1[8] * m2[10] + m1[12] * m2[11];
    mat[9] = m1[1] * m2[8] + m1[5] * m2[9] + m1[9] * m2[10] + m1[13] * m2[11];
    mat[10] = m1[2] * m2[8] + m1[6] * m2[9] + m1[10] * m2[10] + m1[14] * m2[11];
    mat[11] = m1[3] * m2[8] + m1[7] * m2[9] + m1[11] * m2[10] + m1[15] * m2[11];

    mat[12] = m1[0] * m2[12] + m1[4] * m2[13] + m1[8] * m2[14] + m1[12] * m2[15];
    mat[13] = m1[1] * m2[12] + m1[5] * m2[13] + m1[9] * m2[14] + m1[13] * m2[15];
    mat[14] = m1[2] * m2[12] + m1[6] * m2[13] + m1[10] * m2[14] + m1[14] * m2[15];
    mat[15] = m1[3] * m2[12] + m1[7] * m2[13] + m1[11] * m2[14] + m1[15] * m2[15];

    return mat;
};

cc.getMat4MultiplyWithMat4 = function (pM1, pM2, swapMat) {
    var m1 = pM1.mat, m2 = pM2.mat;
    var mat = swapMat.mat;

    mat[0] = m1[0] * m2[0] + m1[4] * m2[1] + m1[8] * m2[2] + m1[12] * m2[3];
    mat[1] = m1[1] * m2[0] + m1[5] * m2[1] + m1[9] * m2[2] + m1[13] * m2[3];
    mat[2] = m1[2] * m2[0] + m1[6] * m2[1] + m1[10] * m2[2] + m1[14] * m2[3];
    mat[3] = m1[3] * m2[0] + m1[7] * m2[1] + m1[11] * m2[2] + m1[15] * m2[3];

    mat[4] = m1[0] * m2[4] + m1[4] * m2[5] + m1[8] * m2[6] + m1[12] * m2[7];
    mat[5] = m1[1] * m2[4] + m1[5] * m2[5] + m1[9] * m2[6] + m1[13] * m2[7];
    mat[6] = m1[2] * m2[4] + m1[6] * m2[5] + m1[10] * m2[6] + m1[14] * m2[7];
    mat[7] = m1[3] * m2[4] + m1[7] * m2[5] + m1[11] * m2[6] + m1[15] * m2[7];

    mat[8] = m1[0] * m2[8] + m1[4] * m2[9] + m1[8] * m2[10] + m1[12] * m2[11];
    mat[9] = m1[1] * m2[8] + m1[5] * m2[9] + m1[9] * m2[10] + m1[13] * m2[11];
    mat[10] = m1[2] * m2[8] + m1[6] * m2[9] + m1[10] * m2[10] + m1[14] * m2[11];
    mat[11] = m1[3] * m2[8] + m1[7] * m2[9] + m1[11] * m2[10] + m1[15] * m2[11];

    mat[12] = m1[0] * m2[12] + m1[4] * m2[13] + m1[8] * m2[14] + m1[12] * m2[15];
    mat[13] = m1[1] * m2[12] + m1[5] * m2[13] + m1[9] * m2[14] + m1[13] * m2[15];
    mat[14] = m1[2] * m2[12] + m1[6] * m2[13] + m1[10] * m2[14] + m1[14] * m2[15];
    mat[15] = m1[3] * m2[12] + m1[7] * m2[13] + m1[11] * m2[14] + m1[15] * m2[15];

    return swapMat.mat;
};

/**
 * Assigns the value of pIn to pOut
 */
cc.kmMat4Assign = function (pOut, pIn) {
    if(pOut == pIn) {
        cc.log("cc.kmMat4Assign(): pOut equals pIn");
        return pOut;
    }

    var outArr = pOut.mat;
    var inArr = pIn.mat;

    outArr[0] = inArr[0];
    outArr[1] = inArr[1];
    outArr[2] = inArr[2];
    outArr[3] = inArr[3];

    outArr[4] = inArr[4];
    outArr[5] = inArr[5];
    outArr[6] = inArr[6];
    outArr[7] = inArr[7];

    outArr[8] = inArr[8];
    outArr[9] = inArr[9];
    outArr[10] = inArr[10];
    outArr[11] = inArr[11];

    outArr[12] = inArr[12];
    outArr[13] = inArr[13];
    outArr[14] = inArr[14];
    outArr[15] = inArr[15];
    return pOut;
};

cc.kmMat4AssignSIMD = function (pOut, pIn) {
    if(pOut == pIn) {
        cc.log("cc.kmMat4Assign(): pOut equals pIn");
        return pOut;
    }

    var outArr = pOut.mat;
    var inArr = pIn.mat;
    
    SIMD.float32x4.store(outArr, 0, SIMD.float32x4.load(inArr, 0));
    SIMD.float32x4.store(outArr, 4, SIMD.float32x4.load(inArr, 4));
    SIMD.float32x4.store(outArr, 8, SIMD.float32x4.load(inArr, 8));
    SIMD.float32x4.store(outArr, 12, SIMD.float32x4.load(inArr, 12));
    
    return pOut;
}

/**
 * Returns KM_TRUE if the 2 matrices are equal (approximately)
 */
cc.kmMat4AreEqual = function (pMat1, pMat2) {
    if(pMat1 == pMat2){
        cc.log("cc.kmMat4AreEqual(): pMat1 and pMat2 are same object.");
        return true;
    }

    for (var i = 0; i < 16; i++) {
        if (!(pMat1.mat[i] + cc.kmEpsilon > pMat2.mat[i] &&
            pMat1.mat[i] - cc.kmEpsilon < pMat2.mat[i])) {
            return false;
        }
    }
    return true;
};

cc.kmMat4AreEqualSIMD = function (pMat1, pMat2) {
    if(pMat1 == pMat2){
        cc.log("cc.kmMat4AreEqual(): pMat1 and pMat2 are same object.");
        return true;
    }

    var m10 = SIMD.float32x4.load(pMat1.mat, 0);
    var m20 = SIMD.float32x4.load(pMat2.mat, 0);
    
    var epsilon = SIMD.float32x4.splat(cc.kmEpsilon);
    
    var ret = SIMD.float32x4.lessThanOrEqual(SIMD.float32x4.abs(SIMD.float32x4.sub(m10, m20)), epsilon);
    if (ret.signMask === 0)
        return false;
        
    var m11 = SIMD.float32x4.load(pMat1.mat, 4);
    var m21 = SIMD.float32x4.load(pMat2.mat, 4);
    ret = SIMD.float32x4.lessThanOrEqual(SIMD.float32x4.abs(SIMD.float32x4.sub(m11, m21)), epsilon);
    if (ret.signMask === 0)
        return false;
    
    var m12 = SIMD.float32x4.load(pMat1.mat, 8);
    var m22 = SIMD.float32x4.load(pMat2.mat, 8);
    ret = SIMD.float32x4.lessThanOrEqual(SIMD.float32x4.abs(SIMD.float32x4.sub(m12, m22)), epsilon);
    if (ret.signMask === 0)
        return false;
    
    var m13 = SIMD.float32x4.load(pMat1.mat, 12);
    var m23 = SIMD.float32x4.load(pMat2.mat, 12);
    ret = SIMD.float32x4.lessThanOrEqual(SIMD.float32x4.abs(SIMD.float32x4.sub(m13, m23)), epsilon);
    if (ret.signMask === 0)
        return false;
    return true;
}

/**
 * Builds an X-axis rotation matrix and stores it in pOut, returns pOut
 */
cc.kmMat4RotationX = function (pOut, radians) {
    /*
     |  1  0       0       0 |
     M = |  0  cos(A) -sin(A)  0 |
     |  0  sin(A)  cos(A)  0 |
     |  0  0       0       1 |

     */

    pOut.mat[0] = 1.0;
    pOut.mat[1] = 0.0;
    pOut.mat[2] = 0.0;
    pOut.mat[3] = 0.0;

    pOut.mat[4] = 0.0;
    pOut.mat[5] = Math.cos(radians);
    pOut.mat[6] = Math.sin(radians);
    pOut.mat[7] = 0.0;

    pOut.mat[8] = 0.0;
    pOut.mat[9] = -Math.sin(radians);
    pOut.mat[10] = Math.cos(radians);
    pOut.mat[11] = 0.0;

    pOut.mat[12] = 0.0;
    pOut.mat[13] = 0.0;
    pOut.mat[14] = 0.0;
    pOut.mat[15] = 1.0;

    return pOut;
};

/**
 * Builds a rotation matrix using the rotation around the Y-axis
 * The result is stored in pOut, pOut is returned.
 */
cc.kmMat4RotationY = function (pOut, radians) {
    /*
     |  cos(A)  0   sin(A)  0 |
     M = |  0       1   0       0 |
     | -sin(A)  0   cos(A)  0 |
     |  0       0   0       1 |
     */
    pOut.mat[0] = Math.cos(radians);
    pOut.mat[1] = 0.0;
    pOut.mat[2] = -Math.sin(radians);
    pOut.mat[3] = 0.0;

    pOut.mat[4] = 0.0;
    pOut.mat[5] = 1.0;
    pOut.mat[6] = 0.0;
    pOut.mat[7] = 0.0;

    pOut.mat[8] = Math.sin(radians);
    pOut.mat[9] = 0.0;
    pOut.mat[10] = Math.cos(radians);
    pOut.mat[11] = 0.0;

    pOut.mat[12] = 0.0;
    pOut.mat[13] = 0.0;
    pOut.mat[14] = 0.0;
    pOut.mat[15] = 1.0;

    return pOut;
};

/**
 * Builds a rotation matrix around the Z-axis. The resulting
 * matrix is stored in pOut. pOut is returned.
 */
cc.kmMat4RotationZ = function (pOut, radians) {
    /*
     |  cos(A)  -sin(A)   0   0 |
     M = |  sin(A)   cos(A)   0   0 |
     |  0        0        1   0 |
     |  0        0        0   1 |
     */
    pOut.mat[0] = Math.cos(radians);
    pOut.mat[1] = Math.sin(radians);
    pOut.mat[2] = 0.0;
    pOut.mat[3] = 0.0;

    pOut.mat[4] = -Math.sin(radians);
    pOut.mat[5] = Math.cos(radians);
    pOut.mat[6] = 0.0;
    pOut.mat[7] = 0.0;

    pOut.mat[8] = 0.0;
    pOut.mat[9] = 0.0;
    pOut.mat[10] = 1.0;
    pOut.mat[11] = 0.0;

    pOut.mat[12] = 0.0;
    pOut.mat[13] = 0.0;
    pOut.mat[14] = 0.0;
    pOut.mat[15] = 1.0;

    return pOut;
};

/**
 * Builds a rotation matrix from pitch, yaw and roll. The resulting
 * matrix is stored in pOut and pOut is returned
 */
cc.kmMat4RotationPitchYawRoll = function (pOut, pitch, yaw, roll) {
    var cr = Math.cos(pitch);
    var sr = Math.sin(pitch);
    var cp = Math.cos(yaw);
    var sp = Math.sin(yaw);
    var cy = Math.cos(roll);
    var sy = Math.sin(roll);
    var srsp = sr * sp;
    var crsp = cr * sp;

    pOut.mat[0] = cp * cy;
    pOut.mat[4] = cp * sy;
    pOut.mat[8] = -sp;

    pOut.mat[1] = srsp * cy - cr * sy;
    pOut.mat[5] = srsp * sy + cr * cy;
    pOut.mat[9] = sr * cp;

    pOut.mat[2] = crsp * cy + sr * sy;
    pOut.mat[6] = crsp * sy - sr * cy;
    pOut.mat[10] = cr * cp;

    pOut.mat[3] = pOut.mat[7] = pOut.mat[11] = 0.0;
    pOut.mat[15] = 1.0;

    return pOut;
};

/** Converts a quaternion to a rotation matrix,
 * the result is stored in pOut, returns pOut
 */
cc.kmMat4RotationQuaternion = function (pOut, pQ) {
    pOut.mat[0] = 1.0 - 2.0 * (pQ.y * pQ.y + pQ.z * pQ.z );
    pOut.mat[1] = 2.0 * (pQ.x * pQ.y + pQ.z * pQ.w);
    pOut.mat[2] = 2.0 * (pQ.x * pQ.z - pQ.y * pQ.w);
    pOut.mat[3] = 0.0;

    // Second row
    pOut.mat[4] = 2.0 * ( pQ.x * pQ.y - pQ.z * pQ.w );
    pOut.mat[5] = 1.0 - 2.0 * ( pQ.x * pQ.x + pQ.z * pQ.z );
    pOut.mat[6] = 2.0 * (pQ.z * pQ.y + pQ.x * pQ.w );
    pOut.mat[7] = 0.0;

    // Third row
    pOut.mat[8] = 2.0 * ( pQ.x * pQ.z + pQ.y * pQ.w );
    pOut.mat[9] = 2.0 * ( pQ.y * pQ.z - pQ.x * pQ.w );
    pOut.mat[10] = 1.0 - 2.0 * ( pQ.x * pQ.x + pQ.y * pQ.y );
    pOut.mat[11] = 0.0;

    // Fourth row
    pOut.mat[12] = 0;
    pOut.mat[13] = 0;
    pOut.mat[14] = 0;
    pOut.mat[15] = 1.0;

    return pOut;
};

/** Build a 4x4 OpenGL transformation matrix using a 3x3 rotation matrix,
 * and a 3d vector representing a translation. Assign the result to pOut,
 * pOut is also returned.
 */
cc.kmMat4RotationTranslation = function (pOut, rotation, translation) {
    pOut.mat[0] = rotation.mat[0];
    pOut.mat[1] = rotation.mat[1];
    pOut.mat[2] = rotation.mat[2];
    pOut.mat[3] = 0.0;

    pOut.mat[4] = rotation.mat[3];
    pOut.mat[5] = rotation.mat[4];
    pOut.mat[6] = rotation.mat[5];
    pOut.mat[7] = 0.0;

    pOut.mat[8] = rotation.mat[6];
    pOut.mat[9] = rotation.mat[7];
    pOut.mat[10] = rotation.mat[8];
    pOut.mat[11] = 0.0;

    pOut.mat[12] = translation.x;
    pOut.mat[13] = translation.y;
    pOut.mat[14] = translation.z;
    pOut.mat[15] = 1.0;

    return pOut;
};

/** Builds a scaling matrix */
cc.kmMat4Scaling = function (pOut, x, y, z) {
    pOut.mat[0] = x;
    pOut.mat[5] = y;
    pOut.mat[10] = z;
    pOut.mat[15] = 1.0;
    pOut.mat[1] = pOut.mat[2] = pOut.mat[3] =
        pOut.mat[4] = pOut.mat[6] = pOut.mat[7] =
            pOut.mat[8] = pOut.mat[9] = pOut.mat[11] =
                pOut.mat[12] = pOut.mat[13] = pOut.mat[14] = 0;
    return pOut;
};

/**
 * Builds a translation matrix. All other elements in the matrix
 * will be set to zero except for the diagonal which is set to 1.0
 */
cc.kmMat4Translation = function (pOut, x, y, z) {
    //FIXME: Write a test for this
    pOut.mat[0] = pOut.mat[5] = pOut.mat[10] = pOut.mat[15] = 1.0;
    pOut.mat[1] = pOut.mat[2] = pOut.mat[3] =
        pOut.mat[4] = pOut.mat[6] = pOut.mat[7] =
            pOut.mat[8] = pOut.mat[9] = pOut.mat[11] = 0.0;
    pOut.mat[12] = x;
    pOut.mat[13] = y;
    pOut.mat[14] = z;
    return pOut;
};

/**
 * Get the up vector from a matrix. pIn is the matrix you
 * wish to extract the vector from. pOut is a pointer to the
 * kmVec3 structure that should hold the resulting vector
 */
cc.kmMat4GetUpVec3 = function (pOut, pIn) {
    pOut.x = pIn.mat[4];
    pOut.y = pIn.mat[5];
    pOut.z = pIn.mat[6];
    cc.kmVec3Normalize(pOut, pOut);
    return pOut;
};

/** Extract the right vector from a 4x4 matrix. The result is
 * stored in pOut. Returns pOut.
 */
cc.kmMat4GetRightVec3 = function (pOut, pIn) {
    pOut.x = pIn.mat[0];
    pOut.y = pIn.mat[1];
    pOut.z = pIn.mat[2];
    cc.kmVec3Normalize(pOut, pOut);
    return pOut;
};

/**
 * Extract the forward vector from a 4x4 matrix. The result is
 * stored in pOut. Returns pOut.
 */
cc.kmMat4GetForwardVec3 = function (pOut, pIn) {
    pOut.x = pIn.mat[8];
    pOut.y = pIn.mat[9];
    pOut.z = pIn.mat[10];
    cc.kmVec3Normalize(pOut, pOut);
    return pOut;
};

/**
 * Creates a perspective projection matrix in the
 * same way as gluPerspective
 */
cc.kmMat4PerspectiveProjection = function (pOut, fovY, aspect, zNear, zFar) {
    var r = cc.kmDegreesToRadians(fovY / 2);
    var deltaZ = zFar - zNear;
    var s = Math.sin(r);

    if (deltaZ == 0 || s == 0 || aspect == 0)
        return null;

    //cos(r) / sin(r) = cot(r)
    var cotangent = Math.cos(r) / s;

    cc.kmMat4Identity(pOut);
    pOut.mat[0] = cotangent / aspect;
    pOut.mat[5] = cotangent;
    pOut.mat[10] = -(zFar + zNear) / deltaZ;
    pOut.mat[11] = -1;
    pOut.mat[14] = -2 * zNear * zFar / deltaZ;
    pOut.mat[15] = 0;

    return pOut;
};

/** Creates an orthographic projection matrix like glOrtho */
cc.kmMat4OrthographicProjection = function (pOut, left, right, bottom, top, nearVal, farVal) {
    cc.kmMat4Identity(pOut);
    pOut.mat[0] = 2 / (right - left);
    pOut.mat[5] = 2 / (top - bottom);
    pOut.mat[10] = -2 / (farVal - nearVal);
    pOut.mat[12] = -((right + left) / (right - left));
    pOut.mat[13] = -((top + bottom) / (top - bottom));
    pOut.mat[14] = -((farVal + nearVal) / (farVal - nearVal));
    return pOut;
};

/**
 * Builds a translation matrix in the same way as gluLookAt()
 * the resulting matrix is stored in pOut. pOut is returned.
 */
cc.kmMat4LookAt = function (pOut, pEye, pCenter, pUp) {
    var f = new cc.kmVec3(), up = new cc.kmVec3(), s = new cc.kmVec3(), u = new cc.kmVec3();
    var translate = new cc.kmMat4();

    cc.kmVec3Subtract(f, pCenter, pEye);
    cc.kmVec3Normalize(f, f);

    cc.kmVec3Assign(up, pUp);
    cc.kmVec3Normalize(up, up);

    cc.kmVec3Cross(s, f, up);
    cc.kmVec3Normalize(s, s);

    cc.kmVec3Cross(u, s, f);
    cc.kmVec3Normalize(s, s);

    cc.kmMat4Identity(pOut);

    pOut.mat[0] = s.x;
    pOut.mat[4] = s.y;
    pOut.mat[8] = s.z;

    pOut.mat[1] = u.x;
    pOut.mat[5] = u.y;
    pOut.mat[9] = u.z;

    pOut.mat[2] = -f.x;
    pOut.mat[6] = -f.y;
    pOut.mat[10] = -f.z;

    cc.kmMat4Translation(translate, -pEye.x, -pEye.y, -pEye.z);
    cc.kmMat4Multiply(pOut, pOut, translate);

    return pOut;
};

cc.kmMat4LookAtSIMD = function (pOut, pEye, pCenter, pUp) {
    var out = pOut.mat;

    var center = SIMD.float32x4.load(pCenter.data, 0);
    var eye = SIMD.float32x4.load(pEye.data, 0);
    var up = SIMD.float32x4.load(pUp.data, 0);

    // cc.kmVec3Subtract(f, pCenter, pEye);
    var f = SIMD.float32x4.sub(center, eye);
    // cc.kmVec3Normalize(f, f);    
    var tmp = SIMD.float32x4.mul(f, f);
    tmp = SIMD.float32x4.add(tmp, SIMD.float32x4.add(SIMD.float32x4.swizzle(tmp, 1, 2, 0, 3), SIMD.float32x4.swizzle(tmp, 2, 0, 1, 3)));
    f = SIMD.float32x4.mul(f, SIMD.float32x4.reciprocalSqrt(tmp));

    // cc.kmVec3Assign(up, pUp);
    // cc.kmVec3Normalize(up, up);
    tmp = SIMD.float32x4.mul(up, up);
    tmp = SIMD.float32x4.add(tmp, SIMD.float32x4.add(SIMD.float32x4.swizzle(tmp, 1, 2, 0, 3), SIMD.float32x4.swizzle(tmp, 2, 0, 1, 3)));
    up = SIMD.float32x4.mul(up, SIMD.float32x4.reciprocalSqrt(tmp));

    // cc.kmVec3Cross(s, f, up);
    var s = SIMD.float32x4.sub(SIMD.float32x4.mul(SIMD.float32x4.swizzle(f, 1, 2, 0, 3), SIMD.float32x4.swizzle(up, 2, 0, 1, 3)),
                               SIMD.float32x4.mul(SIMD.float32x4.swizzle(f, 2, 0, 1, 3), SIMD.float32x4.swizzle(up, 1, 2, 0, 3)));
    // cc.kmVec3Normalize(s, s);
    tmp = SIMD.float32x4.mul(s, s);
    tmp = SIMD.float32x4.add(tmp, SIMD.float32x4.add(SIMD.float32x4.swizzle(tmp, 1, 2, 0, 3), SIMD.float32x4.swizzle(tmp, 2, 0, 1, 3)));
    s = SIMD.float32x4.mul(s, SIMD.float32x4.reciprocalSqrt(tmp));

    // cc.kmVec3Cross(u, s, f);
    var u = SIMD.float32x4.sub(SIMD.float32x4.mul(SIMD.float32x4.swizzle(s, 1, 2, 0, 3), SIMD.float32x4.swizzle(f, 2, 0, 1, 3)),
                               SIMD.float32x4.mul(SIMD.float32x4.swizzle(s, 2, 0, 1, 3), SIMD.float32x4.swizzle(f, 1, 2, 0, 3)));
    // cc.kmVec3Normalize(s, s);
    tmp = SIMD.float32x4.mul(s, s);
    tmp = SIMD.float32x4.add(tmp, SIMD.float32x4.add(SIMD.float32x4.swizzle(tmp, 1, 2, 0, 3), SIMD.float32x4.swizzle(tmp, 2, 0, 1, 3)));
    s = SIMD.float32x4.mul(s, SIMD.float32x4.reciprocalSqrt(tmp));

    //cc.kmMat4Identity(pOut);
    //pOut.mat[0] = s.x;
    //pOut.mat[4] = s.y;
    //pOut.mat[8] = s.z;
    //pOut.mat[1] = u.x;
    //pOut.mat[5] = u.y;
    //pOut.mat[9] = u.z;
    //pOut.mat[2] = -f.x;
    //pOut.mat[6] = -f.y;
    //pOut.mat[10] = -f.z;
    var zero = SIMD.float32x4.splat(0.0);
    f = SIMD.float32x4.neg(f);
    var tmp01 = SIMD.float32x4.shuffle(s, u, 0, 1, 4, 5);
    var tmp23 = SIMD.float32x4.shuffle(f, zero, 0, 1, 4, 5);
    var a0  = SIMD.float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
    var a1  = SIMD.float32x4.shuffle(tmp01, tmp23, 1, 3, 5, 7);

    var tmp01 = SIMD.float32x4.shuffle(s, u, 2, 3, 6, 7);
    var tmp23 = SIMD.float32x4.shuffle(f, zero, 2, 3, 6, 7);
    var a2  = SIMD.float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
    var a3  = SIMD.float32x4(0.0, 0.0, 0.0, 1.0);

    // cc.kmMat4Translation(translate, -pEye.x, -pEye.y, -pEye.z);
    var b0 = SIMD.float32x4(1.0, 0.0, 0.0, 0.0);
    var b1 = SIMD.float32x4(0.0, 1.0, 0.0, 0.0);
    var b2 = SIMD.float32x4(0.0, 0.0, 1.0, 0.0);
    var b3 = SIMD.float32x4.neg(eye);
    b3 = SIMD.float32x4.withW(b3, 1.0);

    // cc.kmMat4Multiply(pOut, pOut, translate);
    SIMD.float32x4.store(out, 0, SIMD.float32x4.add(
        SIMD.float32x4.mul(
            SIMD.float32x4.swizzle(b0, 0, 0, 0, 0), a0),
            SIMD.float32x4.add(
                 SIMD.float32x4.mul(SIMD.float32x4.swizzle(b0, 1, 1, 1, 1), a1),
                 SIMD.float32x4.add(
                      SIMD.float32x4.mul(SIMD.float32x4.swizzle(b0, 2, 2, 2, 2), a2),
                      SIMD.float32x4.mul(SIMD.float32x4.swizzle(b0, 3, 3, 3, 3), a3)))));
    SIMD.float32x4.store(out, 4, SIMD.float32x4.add(
        SIMD.float32x4.mul(
            SIMD.float32x4.swizzle(b1, 0, 0, 0, 0), a0),
            SIMD.float32x4.add(
                SIMD.float32x4.mul(SIMD.float32x4.swizzle(b1, 1, 1, 1, 1), a1),
                SIMD.float32x4.add(
                     SIMD.float32x4.mul(SIMD.float32x4.swizzle(b1, 2, 2, 2, 2), a2),
                     SIMD.float32x4.mul(SIMD.float32x4.swizzle(b1, 3, 3, 3, 3), a3)))));
    SIMD.float32x4.store(out, 8, SIMD.float32x4.add(
        SIMD.float32x4.mul(
            SIMD.float32x4.swizzle(b2, 0, 0, 0, 0), a0),
            SIMD.float32x4.add(
                SIMD.float32x4.mul(SIMD.float32x4.swizzle(b2, 1, 1, 1, 1), a1),
                SIMD.float32x4.add(
                     SIMD.float32x4.mul(SIMD.float32x4.swizzle(b2, 2, 2, 2, 2), a2),
                     SIMD.float32x4.mul(SIMD.float32x4.swizzle(b2, 3, 3, 3, 3), a3)))));
    SIMD.float32x4.store(out, 12, SIMD.float32x4.add(
        SIMD.float32x4.mul(
            SIMD.float32x4.swizzle(b3, 0, 0, 0, 0), a0),
            SIMD.float32x4.add(
                SIMD.float32x4.mul(SIMD.float32x4.swizzle(b3, 1, 1, 1, 1), a1),
                SIMD.float32x4.add(
                    SIMD.float32x4.mul(SIMD.float32x4.swizzle(b3, 2, 2, 2, 2), a2),
                    SIMD.float32x4.mul(SIMD.float32x4.swizzle(b3, 3, 3, 3, 3), a3)))));
    return pOut;
}

/**
 * Build a rotation matrix from an axis and an angle. Result is stored in pOut.
 * pOut is returned.
 */
cc.kmMat4RotationAxisAngle = function (pOut, axis, radians) {
    var rcos = Math.cos(radians);
    var rsin = Math.sin(radians);

    var normalizedAxis = new cc.kmVec3();
    cc.kmVec3Normalize(normalizedAxis, axis);

    pOut.mat[0] = rcos + normalizedAxis.x * normalizedAxis.x * (1 - rcos);
    pOut.mat[1] = normalizedAxis.z * rsin + normalizedAxis.y * normalizedAxis.x * (1 - rcos);
    pOut.mat[2] = -normalizedAxis.y * rsin + normalizedAxis.z * normalizedAxis.x * (1 - rcos);
    pOut.mat[3] = 0.0;

    pOut.mat[4] = -normalizedAxis.z * rsin + normalizedAxis.x * normalizedAxis.y * (1 - rcos);
    pOut.mat[5] = rcos + normalizedAxis.y * normalizedAxis.y * (1 - rcos);
    pOut.mat[6] = normalizedAxis.x * rsin + normalizedAxis.z * normalizedAxis.y * (1 - rcos);
    pOut.mat[7] = 0.0;

    pOut.mat[8] = normalizedAxis.y * rsin + normalizedAxis.x * normalizedAxis.z * (1 - rcos);
    pOut.mat[9] = -normalizedAxis.x * rsin + normalizedAxis.y * normalizedAxis.z * (1 - rcos);
    pOut.mat[10] = rcos + normalizedAxis.z * normalizedAxis.z * (1 - rcos);
    pOut.mat[11] = 0.0;

    pOut.mat[12] = 0.0;
    pOut.mat[13] = 0.0;
    pOut.mat[14] = 0.0;
    pOut.mat[15] = 1.0;

    return pOut;
};

/**
 * Extract a 3x3 rotation matrix from the input 4x4 transformation.
 * Stores the result in pOut, returns pOut
 */
cc.kmMat4ExtractRotation = function (pOut, pIn) {
    pOut.mat[0] = pIn.mat[0];
    pOut.mat[1] = pIn.mat[1];
    pOut.mat[2] = pIn.mat[2];

    pOut.mat[3] = pIn.mat[4];
    pOut.mat[4] = pIn.mat[5];
    pOut.mat[5] = pIn.mat[6];

    pOut.mat[6] = pIn.mat[8];
    pOut.mat[7] = pIn.mat[9];
    pOut.mat[8] = pIn.mat[10];

    return pOut;
};

cc.kmMat4ExtractPlane = function (pOut, pIn, plane) {
    switch (plane) {
        case cc.KM_PLANE_RIGHT:
            pOut.a = pIn.mat[3] - pIn.mat[0];
            pOut.b = pIn.mat[7] - pIn.mat[4];
            pOut.c = pIn.mat[11] - pIn.mat[8];
            pOut.d = pIn.mat[15] - pIn.mat[12];
            break;
        case cc.KM_PLANE_LEFT:
            pOut.a = pIn.mat[3] + pIn.mat[0];
            pOut.b = pIn.mat[7] + pIn.mat[4];
            pOut.c = pIn.mat[11] + pIn.mat[8];
            pOut.d = pIn.mat[15] + pIn.mat[12];
            break;
        case cc.KM_PLANE_BOTTOM:
            pOut.a = pIn.mat[3] + pIn.mat[1];
            pOut.b = pIn.mat[7] + pIn.mat[5];
            pOut.c = pIn.mat[11] + pIn.mat[9];
            pOut.d = pIn.mat[15] + pIn.mat[13];
            break;
        case cc.KM_PLANE_TOP:
            pOut.a = pIn.mat[3] - pIn.mat[1];
            pOut.b = pIn.mat[7] - pIn.mat[5];
            pOut.c = pIn.mat[11] - pIn.mat[9];
            pOut.d = pIn.mat[15] - pIn.mat[13];
            break;
        case cc.KM_PLANE_FAR:
            pOut.a = pIn.mat[3] - pIn.mat[2];
            pOut.b = pIn.mat[7] - pIn.mat[6];
            pOut.c = pIn.mat[11] - pIn.mat[10];
            pOut.d = pIn.mat[15] - pIn.mat[14];
            break;
        case cc.KM_PLANE_NEAR:
            pOut.a = pIn.mat[3] + pIn.mat[2];
            pOut.b = pIn.mat[7] + pIn.mat[6];
            pOut.c = pIn.mat[11] + pIn.mat[10];
            pOut.d = pIn.mat[15] + pIn.mat[14];
            break;
        default:
            cc.log("cc.kmMat4ExtractPlane(): Invalid plane index");
            break;
    }

    var t = Math.sqrt(pOut.a * pOut.a +
        pOut.b * pOut.b +
        pOut.c * pOut.c);
    pOut.a /= t;
    pOut.b /= t;
    pOut.c /= t;
    pOut.d /= t;

    return pOut;
};

/**
 * Take the rotation from a 4x4 transformation matrix, and return it as an axis and an angle (in radians)
 * returns the output axis.
 */
cc.kmMat4RotationToAxisAngle = function (pAxis, radians, pIn) {
    /*Surely not this easy?*/
    var temp = new cc.kmQuaternion();
    var rotation = new cc.kmMat3();
    cc.kmMat4ExtractRotation(rotation, pIn);
    cc.kmQuaternionRotationMatrix(temp, rotation);
    cc.kmQuaternionToAxisAngle(temp, pAxis, radians);
    return pAxis;
};





