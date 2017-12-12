import { LegacyUnit } from '@ephox/mcagar';
import { Pipeline } from '@ephox/agar';
import Promise from 'tinymce/core/util/Promise';
import { UnitTest } from '@ephox/refute';

UnitTest.asynctest('browser.tinymce.core.util.PromiseTest', function() {
  var success = arguments[arguments.length - 2];
  var failure = arguments[arguments.length - 1];
  var suite = LegacyUnit.createSuite();

  suite.asyncTest('Promise resolve', function (_, done) {
    new Promise(function (resolve) {
      resolve("123");
    }).then(function (result) {
      LegacyUnit.equal("123", result);
      done();
    });
  });

  suite.asyncTest('Promise reject', function (_, done) {
    new Promise(function (resolve, reject) {
      reject("123");
    }).then(function () {
    }, function (result) {
      LegacyUnit.equal("123", result);
      done();
    });
  });

  suite.asyncTest('Promise reject', function (_, done) {
    var promises = [
      new Promise(function (resolve) {
        resolve("123");
      }),

      new Promise(function (resolve) {
        resolve("456");
      })
    ];

    Promise.all(promises).then(function (results) {
      LegacyUnit.equal("123", results[0]);
      LegacyUnit.equal("456", results[1]);
      done();
    });
  });

  Pipeline.async({}, suite.toSteps({}), function () {
    success();
  }, failure);
});

