export const route = (
    url: Route,
    propsParams: Record<string, string | number>,
): string => {
    let newUrl: string = url;
    Object.keys(propsParams).forEach((param) => {
        newUrl = newUrl.replace(`:${param}`, String(propsParams[param]));
    });
    return newUrl;
};

export enum Route {
    Dashboard = '/',

    Profile = '/profile',
    ProfileEdit = '/profile/edit',
    ProfileEditPassword = '/profile/edit/password',

    AuthLogin = '/auth/login',
    AuthRegister = '/auth/register',
    AuthLogout = '/auth/logout',
    AuthForgotPassword = '/auth/forgot-password',
    AuthConfirmForgotPassword = '/auth/confirm-forgot-password',

    Configs = '/configs',
    ConfigEdit = '/configs/edit/:id',

    Roles = '/roles',
    RoleDetail = '/roles/:id',
    RoleCreate = '/roles/create',
    RoleEdit = '/roles/edit/:id',
    RoleDelete = '/roles/delete/:id',

    RolePermissions = '/role-permissions',
    RolePermissionDetail = '/role-permissions/:id',
    RolePermissionCreate = '/role-permissions/create',
    RolePermissionEdit = '/role-permissions/edit/:id',
    RolePermissionDelete = '/role-permissions/delete/:id',

    Permissions = '/permissions',
    PermissionDetail = '/permissions/:id',

    Users = '/users',
    UserDetail = '/users/:id',
    UserCreate = '/users/create',
    UserEdit = '/users/edit/:id',
    UserDelete = '/users/delete/:id',
    UserDeleteBatch = '/users/deletes',

    LogActivity = '/logs',
    LogActivityDetail = '/logs/:id',

    Notification = '/notifications',
    NotificationDetail = '/notifications/:id',
    NotificationMarkReadAll = '/notifications/mark-read-all',

    CommonUploadFile = '/commons/upload-file',
    CommonUploadFiles = '/commons/upload-files',

    SampleDetailBasic = '/sample/detail/basic',
    SampleDetailAdvanced = '/sample/detail/advanced',

    SampleFormBasic = '/sample/form/basic',
    SampleFormStep = '/sample/form/step',
    SampleFormAdvanced = '/sample/form/advanced',

    Movies = '/movies',
    MovieDetail = '/movies/:id',
    MovieCreate = '/movies/create',
    MovieEdit = '/movies/edit/:id',
    MovieDelete = '/movies/delete/:id',
    UploadPhoto = '/movies/upload-photo',

    Tags = '/tags',
    TagsDetail = '/tags/:id',
    TagsEdit = '/tags/edit/:id',
    TagsCreate = '/tags/create',
    TagsDelete = '/tags/delete/:id',

    Studios = '/studios',
    StudiosDetail = '/studios/:id',
    StudiosEdit = '/studios/edit/:id',
    StudiosCreate = '/studios/create',
    StudiosDelete = '/studios/delete/:id',

    MovieSchedules = '/movie-schedules',
    MovieSchedulesDetail = '/movie-schedules/:id',
    MovieSchedulesEdit = '/movie-schedules/edit/:id',
    MovieSchedulesCreate = '/movie-schedules/create',
    MovieSchedulesDelete = '/movie-schedules/delete/:id',
}
