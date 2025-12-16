<script lang="ts">
    let {
        label,
        customClass,
        type,
        name,
        placeholder,
        isDisabled = false,
        isTextarea = false,
        value = $bindable(type === 'checkbox' ? false : ""),
    } : {
        label?: string,
        customClass?: string,
        type: string,
        name: string,
        placeholder?: string,
        isDisabled?: boolean,
        isTextarea?: boolean,
        value?: string | number | boolean,
    } = $props();

    let isPasswordVisible = $state(false);

    function onVisibilityIconClick() {
        isPasswordVisible = !isPasswordVisible;
    }

    let inputType = $derived(type === 'password' && isPasswordVisible ? 'text' : type);
</script>

<div class="input-container {customClass ?? ''}">
    {#if label}
        <label class="input-container-label" for={name}>{label}</label>
    {/if}

    {#if isTextarea}
        <textarea class="input-container-input input-container-text-area" id={name} placeholder={placeholder} disabled={isDisabled} bind:value></textarea>
    {:else}
        <div class="input-container-input-wrapper">
            <input class="input-container-input" type={inputType} id={name} placeholder={placeholder} disabled={isDisabled} bind:value />
            {#if type === 'password'}
                <button type="button" class="input-container-input-password-icon material-icons bolder" onclick={onVisibilityIconClick} aria-label="Toggle password visibility" >
                    {isPasswordVisible ? "visibility_off" : "visibility"}
                </button>
            {/if}
        </div>
    {/if}
</div>

<style lang="scss">
    .input-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 1rem;
        width: 100%;

        &-label {
            font-size: 1rem;
            margin-bottom: 0.2rem;
            color: var(--main-text-color);
            font-weight: bold;
        }

        &-checkbox-input-wrapper{
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 0.5rem;
            padding: 0 1.5rem;
            width: 100%;
            gap: 0.5rem;
        }

        &-input {
            height: 2.2rem;
            width: 100%;
            padding: 0.3rem 0.5rem;
            border-radius: 0.375rem;
            background-color: rgba(var(--main-background-color), 0.9);
            border: 1px solid rgba(30, 138, 182, 0.4);
            color: var(--main-text-color);
            font-size: 1rem;

            &:disabled {
                background-color: #f0f0f0;
                cursor: not-allowed;
            }

            &:hover {
                color: var(--second-highlight-color);
                border: 1px solid rgba(30, 138, 182, 0.4);
            }

            &:focus-visible {
                border: 1px solid rgba(30, 138, 182, 0.4) !important;
                outline: none;
            }
            
            &:focus {
                outline: none;
            }

            &-wrapper {
                width: 100%;
                position: relative;
                display: flex;
                align-items: center;
            }

            &-password-icon {
                font-size: 1.2rem;
                position: absolute;
                right: 1rem;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
                color: var(--main-text-color);
                border: none;
                background: transparent;
            }
        }

        &-text-area {
            height: 10rem;
            width: 100%;
            padding: 0.3rem 0.5rem;
            border-radius: 0.375rem;
            background-color: rgba(var(--main-background-color), 0.9);
            border: 1px solid rgba(30, 138, 182, 0.4);
            color: var(--main-text-color);
            font-size: 1rem;
            resize: none;
        }
    }
</style>