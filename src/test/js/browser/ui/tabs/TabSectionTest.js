asynctest(
  'TabSection Test',

  [
    'ephox.agar.api.ApproxStructure',
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Step',
    'ephox.alloy.api.component.GuiFactory',
    'ephox.alloy.api.events.AlloyTriggers',
    'ephox.alloy.api.ui.Container',
    'ephox.alloy.api.ui.Tabbar',
    'ephox.alloy.api.ui.TabSection',
    'ephox.alloy.test.GuiSetup',
    'ephox.katamari.api.Fun'
  ],

  function (ApproxStructure, Assertions, Step, GuiFactory, AlloyTriggers, Container, Tabbar, TabSection, GuiSetup, Fun) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    GuiSetup.setup(function (store, doc, body) {
      return GuiFactory.build(
        TabSection.sketch({
          selectFirst: false,
          dom: {
            tag: 'div'
          },
          components: [
            TabSection.parts().tabbar({
              dom: {
                tag: 'div'
              },
              components: [
                Tabbar.parts().tabs({ })
              ],
              markers: {
                tabClass: 'test-tab-button',
                selectedClass: 'selected-test-tab-button'
              }
            }),
            TabSection.parts().tabview({
              dom: {
                tag: 'div'
              }
            })
          ],

          tabs: [
            {
              uid: 'alpha-tab',
              value: 'alpha',
              dom: { tag: 'button', innerHtml: 'A' },
              view: function () {
                return [
                  Container.sketch({
                    dom: {
                      innerHtml: 'This is the view for "A"'
                    },
                    components: [ ]
                  })
                ];
              }
            },
            {
              uid: 'beta-tab',
              value: 'beta',
              dom: { tag: 'button', innerHtml: 'B' },
              view: function () {
                return [
                  Container.sketch({
                    dom: {
                      innerHtml: 'This is the view for "B"'
                    },
                    components: [ ]
                  })
                ];
              }
            }
          ]
        })
      );

    }, function (doc, body, gui, component, store) {
      return [
        GuiSetup.mAddStyles(doc, [
          '.selected-test-tab-button { background: #cadbee; }'
        ]),
        Assertions.sAssertStructure('Checking initial tab section', ApproxStructure.build(function (s, str, arr) {
          return s.element('div', {
            children: [
              s.element('div', {
                children: [
                  s.element('button', {
                    html: str.is('A'),
                    attrs: {
                      'data-alloy-id': str.is('alpha-tab'),
                      'aria-selected': str.is('false')
                    },
                    classes: [
                      arr.has('test-tab-button')
                    ]
                  }),

                  s.element('button', {
                    html: str.is('B'),
                    attrs: {
                      'data-alloy-id': str.is('beta-tab'),
                      'aria-selected': str.is('false')
                    },
                    classes: [
                      arr.has('test-tab-button')
                    ]
                  })
                ]
              }),
              s.element('div', { })
            ]
          });
        }), component.element()),

        Step.sync(function () {
          var alpha = component.getSystem().getByUid('alpha-tab').getOrDie();
          AlloyTriggers.emitExecute(alpha);
          var beta = component.getSystem().getByUid('beta-tab').getOrDie();
          Assertions.assertStructure('alpha after execute(alpha)', ApproxStructure.build(function (s, str, arr) {
            return s.element('button', {
              attrs: {
                'aria-selected': str.is('true')
              },
              classes: [ arr.has('selected-test-tab-button') ]
            });
          }), alpha.element());
          Assertions.assertStructure('beta after execute(alpha)', ApproxStructure.build(function (s, str, arr) {
            return s.element('button', {
              attrs: {
                'aria-selected': str.is('false')
              },
              classes: [ arr.not('selected-test-tab-button') ]
            });
          }), beta.element());
        }),

        GuiSetup.mRemoveStyles
      ];
    }, function () { success(); }, failure);

  }
);