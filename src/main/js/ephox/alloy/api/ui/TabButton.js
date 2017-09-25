define(
  'ephox.alloy.api.ui.TabButton',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Focusing',
    'ephox.alloy.api.behaviour.Keying',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.api.ui.Sketcher',
    'ephox.alloy.ui.common.ButtonBase',
    'ephox.boulder.api.FieldPresence',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Id'
  ],

  function (Behaviour, Focusing, Keying, Representing, Sketcher, ButtonBase, FieldPresence, FieldSchema, ValueSchema, Id) {
    var factory = function (detail, spec) {
      var events = ButtonBase.events(detail.action());

      return {
        uid: detail.uid(),
        dom: detail.dom(),
        components: detail.components(),
        events: events,
        behaviours: Behaviour.derive([
          Focusing.config({ }),
          Keying.config({
            mode: 'execution',
            useSpace: true,
            useEnter: true
          }),
          Representing.config({
            store: {
              mode: 'memory',
              initialValue: detail.value()
            }
          })
        ]),

        domModification: detail.domModification()
      };
    };

    return Sketcher.single({
      name: 'TabButton',
      configFields: [
        FieldSchema.defaulted('uid', undefined),
        FieldSchema.strict('value'),
        FieldSchema.field('dom', 'dom', FieldPresence.mergeWithThunk(function (spec) {
          return {
            attributes: {
              role: 'tab',
              // NOTE: This is used in TabSection to connect "labelledby"
              id: Id.generate('aria'),
              'aria-selected': 'false'
            }
          };
        }), ValueSchema.anyValue()),
        FieldSchema.option('action'),
        FieldSchema.defaulted('domModification', { }),

        FieldSchema.strict('view')
      ],
      factory: factory
    });
  }
);