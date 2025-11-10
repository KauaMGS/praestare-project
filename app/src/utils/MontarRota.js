export function MontarRota(path, component_url, layout, papeis, page_name) {
    return {
        path: path,
        component: () => component_url,
        meta: {
            layout: layout,
            papeis: papeis,
            page_name: page_name
        }
    };
}