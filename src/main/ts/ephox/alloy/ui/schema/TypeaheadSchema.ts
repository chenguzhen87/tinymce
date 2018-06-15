import { FieldProcessorAdt, FieldSchema } from '@ephox/boulder';
import { Cell, Fun, Option } from '@ephox/katamari';

import Strings from '../../alien/Strings';
import { Coupling } from '../../api/behaviour/Coupling';
import { Focusing } from '../../api/behaviour/Focusing';
import { Keying } from '../../api/behaviour/Keying';
import { Representing } from '../../api/behaviour/Representing';
import { Sandboxing } from '../../api/behaviour/Sandboxing';
import { Streaming } from '../../api/behaviour/Streaming';
import { Toggling } from '../../api/behaviour/Toggling';
import * as SketchBehaviours from '../../api/component/SketchBehaviours';
import * as Fields from '../../data/Fields';
import * as PartType from '../../parts/PartType';
import * as InputBase from '../common/InputBase';
import { TypeaheadDetail } from 'ephox/alloy/ui/types/TypeaheadTypes';
import { AlloyBehaviour } from 'ephox/alloy/api/behaviour/Behaviour';
import { AlloyComponent } from 'ephox/alloy/api/component/ComponentApi';

const schema: () => FieldProcessorAdt[] = Fun.constant([
  FieldSchema.option('lazySink'),
  FieldSchema.strict('fetch'),
  FieldSchema.defaulted('minChars', 5),
  Fields.onHandler('onOpen'),
  FieldSchema.defaulted('eventOrder', { }),

  Fields.onKeyboardHandler('onExecute'),
  FieldSchema.defaulted('matchWidth', true),
  FieldSchema.defaulted('dismissOnBlur', true),
  Fields.markers([ 'openClass' ]),

  SketchBehaviours.field('typeaheadBehaviours', [
    Focusing, Representing, Streaming, Keying, Toggling, Coupling
  ]),

  FieldSchema.state('previewing', function () {
    return Cell(true);
  })
].concat(
  InputBase.schema()
));

const parts: () => PartType.PartTypeAdt[] = Fun.constant([
  PartType.external({
    schema: [
      Fields.tieredMenuMarkers()
    ],
    name: 'menu',
    overrides (detail: TypeaheadDetail) {
      return {
        fakeFocus: true,
        onHighlight (menu: AlloyComponent, item: AlloyComponent) {
          if (! detail.previewing().get()) {
            menu.getSystem().getByUid(detail.uid()).each(function (input) {
              Representing.setValueFrom(input, item);
            });
          } else {
            // Highlight the rest of the text so that the user types over it.
            menu.getSystem().getByUid(detail.uid()).each(function (input) {
              const currentValue = Representing.getValue(input).text;
              const nextValue = Representing.getValue(item);
              if (Strings.startsWith(nextValue.text, currentValue)) {
                Representing.setValue(input, nextValue);
                const inputEl = input.element().dom() as HTMLInputElement;
                inputEl.setSelectionRange(currentValue.length, nextValue.text.length);
              }

            });
          }
          detail.previewing().set(false);
        },
        onExecute (menu: AlloyComponent, item: AlloyComponent) {
          return menu.getSystem().getByUid(detail.uid()).toOption().bind((typeahead) => {
            const sandbox = Coupling.getCoupled(typeahead, 'sandbox');
            const system = item.getSystem();
            // Closing the sandbox takes the item out of the system, so keep a reference.
            Sandboxing.close(sandbox);
            return system.getByUid(detail.uid()).toOption().bind((input) => {
              Representing.setValueFrom(input, item);
              const currentValue: { value: string, text: string } = Representing.getValue(input);

              // Typeaheads, really shouldn't be textareas.
              const inputEl = input.element().dom() as HTMLInputElement;
              inputEl.setSelectionRange(currentValue.text.length, currentValue.text.length);
              detail.onExecute()(sandbox, input, currentValue);
              return Option.some(true);
            });
          });
        },

        onHover (menu: AlloyComponent, item: AlloyComponent) {
          menu.getSystem().getByUid(detail.uid()).each(function (input) {
            Representing.setValueFrom(input, item);
          });
        }
      };
    }
  })
]);

const name = Fun.constant('Typeahead');

export {
  name,
  schema,
  parts
};