import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import DynamicList, { type DynamicListProps } from '@/components/DynamicList.vue';

vi.mock('@/components/FormField.vue', () => ({
    default: {
        name: 'FormField',
        template: '<input />',
    },
}));

interface TestItem {
    id: string;
    value: string;
}

interface DynamicListInstance {
    addItem: () => void;
    items: TestItem[];
}

describe('DynamicList.vue', () => {
    const items = [
        { id: '1', value: 'Item 1' },
        { id: '2', value: 'Item 2' },
    ] as TestItem[];

    const onUpdate = () => {};

    const getKey = (item: TestItem, index: number) => {
        return items[index].id;
    };

    function getDefaultProps(): DynamicListProps<TestItem> {
        return {
            title: 'Test List',
            items: items,
            maxItems: 5,
            sortable: true,
            defaultItem: () => ({ id: Date.now().toString(), value: '' }),
            onUpdate: onUpdate,
            getKey: getKey,
        };
    }

    it('renders the list with the correct title and buttons', () => {
        const wrapper = mount(DynamicList as unknown as new () => typeof DynamicList, {
            props: getDefaultProps(),
        });

        expect(wrapper.find('h2').text()).toBe('Test List');
        expect(wrapper.find('[data-action="add"]').exists()).toBe(true);
        expect(wrapper.find('[data-action="sort"]').exists()).toBe(true);
    });

    it('adds a new item when "Add" button is clicked', async () => {
        const wrapper = mount(DynamicList as unknown as new () => typeof DynamicList, {
            props: getDefaultProps(),
        });

        const addButton = wrapper.find('[data-action="add"]');
        await addButton.trigger('click');

        const items = wrapper.emitted('update')?.[0]?.[0] as TestItem[];
        expect(items).toBeTruthy();
        expect(items.length).toBe(3);
    });

    it('removes an item when "Remove" button is clicked', async () => {
        const wrapper = mount(DynamicList as unknown as new () => typeof DynamicList, {
            props: {
                ...getDefaultProps(),
                items: [{ id: '1', value: 'Item 1' }],
            },
            slots: {
                'item-fields': `
          <template #item-fields="{ removeItem }">
            <button data-action="remove" @click="removeItem"></button>
          </template>
        `,
            },
        });

        await wrapper.find('[data-action="remove"]').trigger('click');

        const items = wrapper.emitted('update')?.[0]?.[0] as TestItem[];
        expect(items).toBeTruthy();
        expect(items.length).toBe(0);
    });

    it('updates an item field when the slot emits an update', async () => {
        const wrapper = mount(DynamicList as unknown as new () => typeof DynamicList, {
            props: getDefaultProps(),
            slots: {
                'item-fields': `
          <template #item-fields="{ updateField }">
            <input
              data-field="value"
              @input="updateField('value', $event.target.value)"
            />
          </template>
        `,
            },
        });

        const input = wrapper.find('input[data-field="value"]');
        await input.setValue('Updated Item');

        expect(wrapper.emitted('update')).toBeTruthy();
        const items = wrapper.emitted('update')?.[0]?.[0] as TestItem[];
        expect(items[0].value).toBe('Updated Item');
    });

    it('sorts the items when the "Sort" button is clicked', async () => {
        const wrapper = mount(DynamicList as unknown as new () => typeof DynamicList, {
            props: {
                ...getDefaultProps(),
                items: [
                    { id: '2', value: 'Item 2' },
                    { id: '1', value: 'Item 1' },
                ],
            },
        });

        await wrapper.find('[data-action="sort"]').trigger('click');

        expect(wrapper.emitted('update')).toBeTruthy();
        const sortedItems = wrapper.emitted('update')?.[0]?.[0];

        expect(sortedItems).toEqual([
            { id: '1', value: 'Item 1' },
            { id: '2', value: 'Item 2' },
        ]);
    });

    it('disables the "Add" button when max items are reached', async () => {
        const items = [
            { id: '1', value: 'Item 1' },
            { id: '2', value: 'Item 2' },
            { id: '3', value: 'Item 3' },
            { id: '4', value: 'Item 4' },
            { id: '5', value: 'Item 5' },
        ] as TestItem[];

        const getKey = (_: TestItem, index: number) => {
            return items[index].id;
        };

        const maxItemsProps = {
            ...getDefaultProps(),
            items,
            getKey,
        };

        const wrapper = mount(DynamicList as unknown as new () => typeof DynamicList, {
            props: {
                ...maxItemsProps,
            },
        });

        const addButton = wrapper.find<HTMLButtonElement>('[data-action="add"]');
        expect(addButton.element.disabled).toBeTruthy();
    });

    it('should not add items when max items are reached', async () => {
        const items = [
            { id: '1', value: 'Item 1' },
            { id: '2', value: 'Item 2' },
            { id: '3', value: 'Item 3' },
            { id: '4', value: 'Item 4' },
            { id: '5', value: 'Item 5' },
        ] as TestItem[];

        const getKey = (_: TestItem, index: number) => {
            return items[index].id;
        };

        const maxItemsProps = {
            ...getDefaultProps(),
            items,
            getKey,
        };

        const wrapper = mount(DynamicList as unknown as new () => typeof DynamicList, {
            props: {
                ...maxItemsProps,
            },
        });

        const instance = wrapper.vm as unknown as DynamicListInstance;

        expect(items.length).toBe(5);
        instance.addItem();
        expect(items.length).toBe(5);
    });

    it('should update the items if the props.items change', async () => {
        const props = getDefaultProps();

        const wrapper = mount(DynamicList as unknown as new () => typeof DynamicList, {
            props: props,
        });

        const instance = wrapper.vm as unknown as DynamicListInstance;
        expect(instance.items).toEqual(props.items);

        await wrapper.setProps({
            items: [
                { id: '3', value: 'Item 3' },
                { id: '4', value: 'Item 4' },
            ],
        });

        expect(instance.items).toEqual([
            { id: '3', value: 'Item 3' },
            { id: '4', value: 'Item 4' },
        ]);
    });
});
