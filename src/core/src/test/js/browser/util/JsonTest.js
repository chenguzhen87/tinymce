import { LegacyUnit } from '@ephox/mcagar';
import { Pipeline } from '@ephox/agar';
import Json from 'tinymce/core/util/JSON';
import { UnitTest } from '@ephox/refute';

UnitTest.asynctest('browser.tinymce.core.util.JsonTest', function() {
  var success = arguments[arguments.length - 2];
  var failure = arguments[arguments.length - 1];
  var suite = LegacyUnit.createSuite();

  suite.test('serialize', function () {
    LegacyUnit.equal(
      Json.serialize({
        arr1: [1, 2, 3, [1, 2, 3]],
        bool1: true,
        float1: 3.14,
        int1: 123,
        null1: null,
        obj1: { key1: "val1", key2: "val2" }, str1: '\"\'abc\u00C5123\\'
      }
      ),
      '{"arr1":[1,2,3,[1,2,3]],"bool1":true,"float1":3.14,"int1":123,"null1":null,' +
      '"obj1":{"key1":"val1","key2":"val2"},"str1":"\\"\'abc\\u00c5123\\\\"}'
    );

    LegacyUnit.equal(
      Json.serialize({
        arr1: [1, 2, 3, [1, 2, 3]],
        bool1: true,
        float1: 3.14,
        int1: 123,
        null1: null,
        obj1: { key1: "val1", key2: "val2" }, str1: '\"\'abc\u00C5123'
      }, "'"
      ),
      "{'arr1':[1,2,3,[1,2,3]],'bool1':true,'float1':3.14,'int1':123,'null1':null," +
      "'obj1':{'key1':'val1','key2':'val2'},'str1':'\\\"\\'abc\\u00c5123'}"
    );
  });

  suite.test('parse', function () {
    LegacyUnit.equal(
      Json.parse('{"arr1":[1,2,3,[1,2,3]],"bool1":true,"float1":3.14,"int1":123,"null1":null,' +
      '"obj1":{"key1":"val1","key2":"val2"},"str1":"abc\\u00c5123"}').str1,
      'abc\u00c5123'
    );
  });

  Pipeline.async({}, suite.toSteps({}), function () {
    success();
  }, failure);
});

