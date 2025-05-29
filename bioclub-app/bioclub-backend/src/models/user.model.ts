import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid'; // Para gerar códigos de referência únicos

// Interface para os atributos do Usuário (para tipagem do documento)
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Opcional porque não será retornado em todas as queries
  cpf: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone?: string;
  referralCode: string; // Código que este usuário compartilha
  referredBy?: Schema.Types.ObjectId | IUser; // ID do usuário que o indicou
  fcmToken?: string; // Firebase Cloud Messaging token
  emailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  isActive: boolean;
  roles: string[]; // Ex: ['user', 'admin']
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface para o Modelo do Usuário (para tipagem estática do modelo)
export interface IUserModel extends Model<IUser> {
  // Aqui podemos adicionar métodos estáticos se necessário no futuro
}

const userSchema = new Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      required: [true, 'O nome é obrigatório.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'O e-mail é obrigatório.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, 'Por favor, insira um e-mail válido.'],
    },
    password: {
      type: String,
      required: [true, 'A senha é obrigatória.'],
      minlength: [6, 'A senha deve ter pelo menos 6 caracteres.'],
      select: false, // Não retorna o password por padrão nas queries
    },
    cpf: {
      type: String,
      required: [true, 'O CPF é obrigatório.'],
      unique: true,
      trim: true,
      // TODO: Adicionar validação de formato de CPF aqui ou no controller/service
    },
    address: {
      street: { type: String, trim: true },
      number: { type: String, trim: true },
      complement: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
    },
    phone: {
      type: String,
      trim: true,
    },
    referralCode: {
      type: String,
      unique: true,
    },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Referência ao mesmo modelo 'User'
    },
    fcmToken: {
      type: String,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true, // Usuário ativo por padrão
    },
    roles: {
      type: [String],
      default: ['user'], // Papel padrão
      enum: ['user', 'admin'], // Papéis possíveis
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    toJSON: {
      virtuals: true, // Permite que virtuals sejam incluídos em res.json()
      transform: function (doc, ret) {
        delete ret.password; // Garante que a senha não seja exposta, mesmo que 'select: false' falhe
        // delete ret.emailVerificationToken; // Removido pois select:false já faz isso
        // delete ret.passwordResetToken;
        // delete ret.passwordResetExpires;
        delete ret.__v;
        ret.id = ret._id; // Mapeia _id para id
        delete ret._id;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        // delete ret.emailVerificationToken;
        // delete ret.passwordResetToken;
        // delete ret.passwordResetExpires;
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// Middleware (pre-save hook) para gerar hash da senha antes de salvar
userSchema.pre<IUser>('save', async function (next) {
  // 'this' refere-se ao documento atual
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Middleware (pre-save hook) para gerar código de referência único
userSchema.pre<IUser>('save', function (next) {
  if (this.isNew && !this.referralCode) {
    // Gera um código de referência simples e único (pode ser melhorado)
    // Exemplo: NOME+SOBRENOME+Random ou um UUID curto
    let baseCode = this.name.split(' ')[0].substring(0, 5).toUpperCase();
    if (this.name.split(' ').length > 1) {
      baseCode += this.name.split(' ')[1].substring(0,3).toUpperCase();
    } else {
      baseCode += Math.random().toString(36).substring(2, 5).toUpperCase();
    }
    this.referralCode = `${baseCode}-${uuidv4().substring(0, 4)}`.toUpperCase();

    // TODO: Adicionar lógica para garantir que o código é realmente único no banco,
    // embora a chance de colisão com UUID seja mínima.
  }
  next();
});

// Método de instância para comparar senha candidata com a senha no banco
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;
