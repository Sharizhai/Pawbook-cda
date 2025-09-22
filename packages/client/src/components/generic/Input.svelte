<script lang="ts">
    let {
        label,
        customClass,
        type,
        name,
        placeholder,
        isDisabled = false,
        required = false,
        value = $bindable(type === 'checkbox' ? false : "")
    } : {
        label?: string,
        customClass?: string,
        type: string,
        name: string,
        placeholder?: string,
        isDisabled?: boolean,
        required?: boolean,
        value?: string | boolean
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

        {#if type === 'checkbox'}
        <div class="input-container-checkbox-input-wrapper">
            <input class="input-container-input" type={type} id={name} name={name} disabled={isDisabled} {required} />
            <label for={name}>{placeholder}</label>
        </div>
        {:else}
        <div class="input-container-input-wrapper">
            <input class="input-container-input" type={inputType} id={name} name={name} placeholder={placeholder} disabled={isDisabled} {required} bind:value />
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
            border: 1px solid var(--color-main-dark);
            background-color: rgba(255, 255, 255, 0.5);
            color: var(--main-text-color);
            font-size: 1rem;

            &[type="checkbox"] {
                padding: 0.7rem !important;
                width: 1rem !important;
                height: 1rem !important;
            }

            &:disabled {
                background-color: #f0f0f0;
                cursor: not-allowed;
            }

            &:hover {
                color: var(--second-highlight-color);
                border: 1px solid var(--second-highlight-color);
            }

            &:focus-visible {
                border: 1px solid var(--second-highlight-color);
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
    }

    .input-container-input[type="checkbox"] {
        width: auto;
        height: auto;
        accent-color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        margin-right: 0.5rem;
        transform: scale(1);
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: rgba(255, 255, 255, 0.5);
        border: 1px solid var(--color-main-dark);
        border-radius: 0.188rem;

        &:checked {
            border: 1px solid var(--color-main-dark);
            background-color: rgba(255, 255, 255, 0.5);
            position: relative;
            
            &::after {
                content: '';
                position: absolute;
                inset: 0;            // Recouvre tout l'élément parent
                margin: auto;
                transform: rotate(45deg);
                width: 0.438rem;
                height: 0.688rem;
                border: solid var(--main-text-color);
                border-width: 0 0.188rem 0.188rem 0;
            }
        }
    }
</style>